import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Serves files written by app/api/upload/route.ts. This is a dynamic Route
// Handler (not Next's `public/` static serving) because `public/` is
// snapshotted at server startup — files uploaded at runtime never show up
// there until the next restart. Reading from disk on every request avoids
// that problem entirely.

const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
};

const uploadsRoot = path.join(process.cwd(), 'uploads');

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // Reject anything that isn't a plain filename under uploadsRoot (blocks path traversal).
  if (!segments || segments.length !== 1 || segments[0].includes('..') || segments[0].includes('/')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const filename = segments[0];
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const filePath = path.join(uploadsRoot, filename);

  // Belt-and-suspenders: ensure the resolved path is still inside uploadsRoot.
  if (!filePath.startsWith(uploadsRoot + path.sep)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const buffer = await fs.promises.readFile(filePath);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
