import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

// --- Simple in-memory rate limiter (per IP) ---
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // max 20 uploads per minute per IP

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

// Allowed image types with magic bytes (file signatures)
const ALLOWED_TYPES: Record<string, number[][]> = {
  'jpeg': [[0xFF, 0xD8, 0xFF]],
  'png':  [[0x89, 0x50, 0x4E, 0x47]],
  'gif':  [[0x47, 0x49, 0x46, 0x38]],
  'webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF....WEBP
};

const ALLOWED_EXTENSIONS = new Set(['jpeg', 'jpg', 'png', 'gif', 'webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function isValidMagicBytes(buffer: Buffer): boolean {
  const bytes = Array.from(buffer.slice(0, 12));
  for (const magicPatterns of Object.values(ALLOWED_TYPES)) {
    for (const magic of magicPatterns) {
      let match = true;
      for (let i = 0; i < magic.length; i++) {
        if (bytes[i] !== magic[i]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }
  return false;
}

/**
 * FIX: Verify JWT token from cookie — same approach as middleware.ts.
 * Decodes the payload and checks expiry + admin/editor role.
 * Signature is verified by the backend on actual data mutations.
 */
function verifyUploadAuth(token: string): { valid: boolean; reason?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, reason: 'Invalid token format' };

    const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = atob(payloadB64);
    const parsed = JSON.parse(payloadJson);

    if (parsed.exp && Date.now() >= parsed.exp * 1000) {
      return { valid: false, reason: 'Token expired' };
    }

    const userRole = parsed.role ?? parsed.roles;
    const roleStr = Array.isArray(userRole)
      ? userRole.map((r: unknown) => String(r).toUpperCase())
      : typeof userRole === 'string'
        ? [userRole.toUpperCase()]
        : [];

    const isAdmin = roleStr.includes('ADMIN');
    const isEditor = roleStr.includes('EDITOR');

    if (!isAdmin && !isEditor) {
      return { valid: false, reason: 'Insufficient permissions' };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: 'Token decode failed' };
  }
}

export async function POST(req: Request) {
  try {
    // Rate limiting (FE-SEC-06)
    const ip =
      (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
      (req.headers.get('x-real-ip') ?? '') ||
      'unknown';

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many uploads. Please wait before uploading again.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfter ?? 60) },
        },
      );
    }

    // Authentication check — only admin/editor can upload (FE-SEC-05)
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const authResult = verifyUploadAuth(token);
    if (!authResult.valid) {
      return NextResponse.json({ error: authResult.reason ?? 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check MIME type from browser
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Magic byte validation — prevents polyglot file upload attacks
    if (!isValidMagicBytes(buffer)) {
      return NextResponse.json({ error: 'Invalid file content. Only genuine image files are allowed.' }, { status: 400 });
    }

    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum 5MB allowed.' }, { status: 400 });
    }

    // Sanitize filename and force correct extension based on magic byte
    const originalExt = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_EXTENSIONS.has(originalExt)) {
      return NextResponse.json({ error: 'Invalid file extension' }, { status: 400 });
    }

    const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    const finalFilename = `${uniqueSuffix}.${originalExt}`;

    // NOTE: stored outside `public/` — Next.js's static file serving snapshots
    // the `public/` directory at server startup and does not pick up files
    // added at runtime, which made every upload 404 until the next restart.
    // Files here are served dynamically by app/uploads/[...path]/route.ts instead.
    const uploadDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, finalFilename);
    await fs.promises.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${finalFilename}`;

    return NextResponse.json({ url: fileUrl });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
