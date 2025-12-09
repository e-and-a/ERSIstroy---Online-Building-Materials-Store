import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const login = formData.get("login");
  const password = formData.get("password");

  const adminLogin = process.env.ADMIN_LOGIN;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminLogin || !adminPassword) {
    return NextResponse.json(
      { success: false, error: "Admin credentials not configured" },
      { status: 500 }
    );
  }

  if (login !== adminLogin || password !== adminPassword) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: "ersi_admin_session",
    value: "ok",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}