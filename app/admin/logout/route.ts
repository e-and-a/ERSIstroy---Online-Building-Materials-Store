import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

function makeLogoutResponse(request: NextRequest) {
  const url = new URL("/admin/login?redirected=1", request.url);

  const res = NextResponse.redirect(url);

  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0
  });

  return res;
}

export function GET(request: NextRequest) {
  return makeLogoutResponse(request);
}

export function POST(request: NextRequest) {
  return makeLogoutResponse(request);
}
