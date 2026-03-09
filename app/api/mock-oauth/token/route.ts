import { NextResponse } from "next/server";
import {
  DEMO_OAUTH_CLIENT_ID,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS
} from "@/lib/auth/constants";
import { sha256Base64Url } from "@/lib/auth/crypto";
import { consumeAuthorizationCode } from "@/lib/auth/mock-oauth-store";
import { signAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type TokenRequestBody = {
  grant_type?: string;
  code?: string;
  client_id?: string;
  redirect_uri?: string;
  code_verifier?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as TokenRequestBody;

  const grantType = body.grant_type;
  const code = body.code;
  const clientId = body.client_id;
  const redirectUri = body.redirect_uri;
  const codeVerifier = body.code_verifier;

  if (
    grantType !== "authorization_code" ||
    !code ||
    clientId !== DEMO_OAUTH_CLIENT_ID ||
    !redirectUri ||
    !codeVerifier
  ) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Неверные параметры обмена кода." },
      { status: 400 }
    );
  }

  const pendingCode = consumeAuthorizationCode(code);

  if (!pendingCode) {
    return NextResponse.json(
      { error: "invalid_grant", error_description: "Код авторизации не найден или истек." },
      { status: 400 }
    );
  }

  if (pendingCode.clientId !== clientId || pendingCode.redirectUri !== redirectUri) {
    return NextResponse.json(
      { error: "invalid_grant", error_description: "Параметры клиента не совпадают." },
      { status: 400 }
    );
  }

  const calculatedChallenge = await sha256Base64Url(codeVerifier);
  if (calculatedChallenge !== pendingCode.codeChallenge) {
    return NextResponse.json(
      { error: "invalid_grant", error_description: "PKCE-проверка не пройдена." },
      { status: 400 }
    );
  }

  const now = Math.floor(Date.now() / 1000);

  await prisma.appUser.upsert({
    where: { id: pendingCode.subject },
    update: { role: pendingCode.role },
    create: {
      id: pendingCode.subject,
      role: pendingCode.role
    }
  });

  const sessionToken = await signAdminSession({
    sub: pendingCode.subject,
    role: pendingCode.role,
    exp: now + SESSION_TTL_SECONDS
  });

  const response = NextResponse.json({
    success: true,
    role: pendingCode.role,
    expiresIn: SESSION_TTL_SECONDS
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS
  });

  return response;
}
