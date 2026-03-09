import { NextRequest, NextResponse } from "next/server";
import { MANAGER_ONLY_PREFIXES, SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifyAdminSession } from "@/lib/auth/session";

const LOGIN_PATH = "/admin/login";
const LOGIN_CALLBACK_PATH = "/admin/login/callback";
const LOGOUT_PATH = "/admin/logout";

function matchesProtectedPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Все, что не /admin — пропускаем
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Логин и логаут не защищаем
  if (pathname === LOGIN_PATH || pathname === LOGIN_CALLBACK_PATH || pathname === LOGOUT_PATH) {
    return NextResponse.next();
  }

  // Проверяем валидную подписанную сессию
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifyAdminSession(sessionCookie);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("redirected", "1");
    return NextResponse.redirect(url);
  }

  const isManagerOnlyRoute = MANAGER_ONLY_PREFIXES.some((prefix) =>
    matchesProtectedPrefix(pathname, prefix)
  );

  if (isManagerOnlyRoute && session.role !== "manager") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/orders";
    url.searchParams.set("forbidden", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
