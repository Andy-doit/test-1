import nodemailer from "nodemailer";
import { logger } from "@/lib/utils/logger";

// IMPORTANT: Use server-only env vars (no NEXT_PUBLIC_ prefix)
// These are NEVER exposed to the browser bundle
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM ?? SMTP_USER;
const SMTP_TO = process.env.NEXT_PUBLIC_CONTACT_RECEIVER_EMAIL ?? SMTP_USER;

/**
 * Build Nodemailer transporter với App Password
 */
export function buildEmailTransporter() {
  const missingVars: string[] = [];
  if (!SMTP_USER) missingVars.push("SMTP_USER");
  if (!SMTP_PASSWORD) missingVars.push("SMTP_PASSWORD");

  if (missingVars.length > 0) {
    throw new Error(
      `Thiếu biến môi trường: ${missingVars.join(", ")}. Vui lòng kiểm tra cấu hình trên server.`
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
    return transporter;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Lỗi khởi tạo transporter";
    logger.error("[Email] Transporter creation error:", {
      message: msg,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Không thể tạo transporter: ${msg}`);
  }
}

/**
 * Validate email configuration
 */
export function validateEmailConfig(): void {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    throw new Error(
      "Thiếu cấu hình email. Vui lòng kiểm tra SMTP_USER và SMTP_PASSWORD (App Password từ Google)."
    );
  }

  if (!SMTP_TO) {
    throw new Error("Thiếu CONTACT_RECEIVER_EMAIL hoặc SMTP_USER.");
  }
}

/**
 * Validate email format
 */
export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get email configuration
 */
export function getEmailConfig() {
  return {
    from: SMTP_FROM,
    to: SMTP_TO,
  };
}

/**
 * Format contact email content
 */
export function formatContactEmail(data: {
  fullname: string;
  email: string;
  message: string;
  optIn: boolean;
}) {
  const { fullname, email, message, optIn } = data;

  const subject = `[HotStock] Liên hệ mới từ ${fullname}`;

  const plainText = [
    `Họ tên: ${fullname}`,
    `Email: ${email}`,
    `Quan tâm nhận thông tin: ${optIn ? "Có" : "Không"}`,
    "",
    "Lời nhắn:",
    message,
  ].join("\n");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #5C278B;">Liên hệ mới từ HotStock</h2>
      <p><strong>Họ tên:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Quan tâm nhận thông tin:</strong> ${optIn ? "Có" : "Không"}</p>
      <p><strong>Lời nhắn:</strong></p>
      <p style="white-space:pre-line; background: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, "<br>")}</p>
    </div>
  `;

  return { subject, text: plainText, html: htmlContent };
}
