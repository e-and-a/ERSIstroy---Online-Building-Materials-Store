import { AUTH_CODE_TTL_MS, type AdminRole } from "@/lib/auth/constants";

type PendingAuthorizationCode = {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  role: AdminRole;
  subject: string;
  expiresAt: number;
};

const authorizationCodes = new Map<string, PendingAuthorizationCode>();

export function issueAuthorizationCode(input: Omit<PendingAuthorizationCode, "expiresAt">) {
  const code = crypto.randomUUID().replace(/-/g, "");
  const expiresAt = Date.now() + AUTH_CODE_TTL_MS;

  authorizationCodes.set(code, {
    ...input,
    expiresAt
  });

  return code;
}

export function consumeAuthorizationCode(code: string) {
  const record = authorizationCodes.get(code);

  if (!record) {
    return null;
  }

  authorizationCodes.delete(code);

  if (record.expiresAt < Date.now()) {
    return null;
  }

  return record;
}
