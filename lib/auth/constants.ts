export const SESSION_COOKIE_NAME = "ersi_admin_session";
export const DEMO_OAUTH_CLIENT_ID = "ersi-admin-pkce-demo";

export const SESSION_TTL_SECONDS = 60 * 60 * 8;
export const AUTH_CODE_TTL_MS = 1000 * 60 * 3;

export const PKCE_STORAGE_KEYS = {
  verifier: "ersi_pkce_verifier",
  state: "ersi_pkce_state"
} as const;

export type AdminRole = "manager" | "viewer";

export const ADMIN_ROLES: AdminRole[] = ["manager", "viewer"];

export const MANAGER_ONLY_PREFIXES = ["/admin/categories", "/admin/products"];
