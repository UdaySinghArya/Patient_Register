import crypto from 'crypto';
import nodemailer from 'nodemailer';

export function hashOtp(email, code) {
  return crypto.createHash('sha256').update(`${email}:${code}`).digest('hex');
}

export function createOtpCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

function mailer() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS must be set in server/.env (Gmail + App Password).');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) !== 587,
    auth: { user, pass },
  });
}

export async function sendOtpEmail(to, code) {
  const from = process.env.SMTP_USER;
  const transporter = mailer();
  await transporter.sendMail({
    from: `"Patient Register" <${from}>`,
    to,
    subject: 'Your Patient Register login code',
    text: `Your login OTP is ${code}. It expires in 10 minutes. If you did not request this, ignore the email.`,
    html: `<p>Your Patient Register login OTP is <strong style="font-size:20px;letter-spacing:2px">${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });
}
