import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES, DEMO_OAUTH_CLIENT_ID, type AdminRole } from "@/lib/auth/constants";
import { issueAuthorizationCode } from "@/lib/auth/mock-oauth-store";

function isAllowedRole(role: string): role is AdminRole {
  return ADMIN_ROLES.includes(role as AdminRole);
}

export function GET(request: NextRequest) {
  const url = request.nextUrl;
  const responseType = url.searchParams.get("response_type");
  const clientId = url.searchParams.get("client_id");
  const redirectUri = url.searchParams.get("redirect_uri");
  const state = url.searchParams.get("state");
  const codeChallenge = url.searchParams.get("code_challenge");
  const codeChallengeMethod = url.searchParams.get("code_challenge_method");
  const roleParam = url.searchParams.get("role");

  if (
    responseType !== "code" ||
    clientId !== DEMO_OAUTH_CLIENT_ID ||
    !redirectUri ||
    !state ||
    !codeChallenge ||
    codeChallengeMethod !== "S256" ||
    !roleParam ||
    !isAllowedRole(roleParam)
  ) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Неверные параметры авторизации." },
      { status: 400 }
    );
  }

  let redirectUrl: URL;
  try {
    redirectUrl = new URL(redirectUri);
  } catch {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Некорректный redirect_uri." },
      { status: 400 }
    );
  }

  if (redirectUrl.origin !== url.origin) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "redirect_uri должен быть в пределах текущего домена." },
      { status: 400 }
    );
  }

  const code = issueAuthorizationCode({
    clientId,
    redirectUri,
    codeChallenge,
    role: roleParam
  });

  redirectUrl.searchParams.set("code", code);
  redirectUrl.searchParams.set("state", state);

  return NextResponse.redirect(redirectUrl);
}
