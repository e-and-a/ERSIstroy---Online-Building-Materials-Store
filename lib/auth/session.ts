import { hmacSha256Hex } from "@/lib/auth/crypto";
import { ADMIN_ROLES, type AdminRole } from "@/lib/auth/constants";

type SessionPayload = {
  sub: string;
  role: AdminRole;
  exp: number;
};

function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET ?? "dev-insecure-session-secret";
}

export async function signAdminSession(payload: SessionPayload) {
  const payloadPart = encodeURIComponent(JSON.stringify(payload));
  const signature = await hmacSha256Hex(payloadPart, getSessionSecret());
  return `${payloadPart}.${signature}`;
}

export async function verifyAdminSession(token: string | undefined | null) {
  if (!token) return null;

  const [payloadPart, signature] = token.split(".");
  if (!payloadPart || !signature) return null;

  const expected = await hmacSha256Hex(payloadPart, getSessionSecret());
  if (expected !== signature) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(decodeURIComponent(payloadPart));
  } catch {
    return null;
  }

  if (!ADMIN_ROLES.includes(payload.role)) return null;

  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp <= now) return null;

  return payload;
}
