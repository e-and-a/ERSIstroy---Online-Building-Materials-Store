export const SESSION_COOKIE_NAME = "ersi_admin_session";
export const DEMO_OAUTH_CLIENT_ID = "ersi-admin-pkce-demo";

export const SESSION_TTL_SECONDS = 60 * 60 * 8;
export const AUTH_CODE_TTL_MS = 1000 * 60 * 3;

export const PKCE_STORAGE_KEYS = {
  verifier: "ersi_pkce_verifier",
  state: "ersi_pkce_state"
} as const;

export type AdminRole = "admin" | "user";

export const ADMIN_ROLES: AdminRole[] = ["admin", "user"];

export const DEMO_ACCOUNTS = {
  adminMain: {
    subject: "admin-main",
    role: "admin",
    label: "Админ"
  },
  userA: {
    subject: "user-a",
    role: "user",
    label: "Пользователь A"
  },
  userB: {
    subject: "user-b",
    role: "user",
    label: "Пользователь B"
  }
} as const;
