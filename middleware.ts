import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "ersi_admin_session";
const LOGIN_PATH = "/admin/login";
const LOGOUT_PATH = "/admin/logout";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Все, что не /admin — пропускаем
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Логин и логаут не защищаем
  if (pathname === LOGIN_PATH || pathname === LOGOUT_PATH) {
    return NextResponse.next();
  }

  // Проверяем куку сессии
  const session = request.cookies.get(SESSION_COOKIE);

  if (!session || !session.value) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("redirected", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};