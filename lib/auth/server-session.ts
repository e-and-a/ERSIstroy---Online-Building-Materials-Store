import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifyAdminSession } from "@/lib/auth/session";

export async function getServerSession() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}
