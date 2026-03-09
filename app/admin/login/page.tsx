"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DEMO_OAUTH_CLIENT_ID, PKCE_STORAGE_KEYS, type AdminRole } from "@/lib/auth/constants";
import { Button } from "@/components/ui/button";

const PKCE_ALLOWED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

function randomPkceString(length: number) {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  let result = "";
  for (let index = 0; index < randomValues.length; index += 1) {
    result += PKCE_ALLOWED_CHARS[randomValues[index] % PKCE_ALLOWED_CHARS.length];
  }
  return result;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function createCodeChallenge(verifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return toBase64Url(new Uint8Array(digest));
}

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loadingRole, setLoadingRole] = useState<AdminRole | null>(null);

  const roleLabels = useMemo(
    () => ({
      manager: "Менеджер (полный доступ)",
      viewer: "Наблюдатель (только заказы)"
    }),
    []
  );

  async function startLogin(role: AdminRole) {
    setLoadingRole(role);
    setError("");

    try {
      const state = randomPkceString(48);
      const verifier = randomPkceString(96);
      const challenge = await createCodeChallenge(verifier);
      const redirectUri = `${window.location.origin}/admin/login/callback`;

      sessionStorage.setItem(PKCE_STORAGE_KEYS.state, state);
      sessionStorage.setItem(PKCE_STORAGE_KEYS.verifier, verifier);

      const params = new URLSearchParams({
        response_type: "code",
        client_id: DEMO_OAUTH_CLIENT_ID,
        redirect_uri: redirectUri,
        state,
        code_challenge: challenge,
        code_challenge_method: "S256",
        role
      });

      window.location.href = `/api/mock-oauth/authorize?${params.toString()}`;
    } catch {
      setError("Не удалось начать PKCE-авторизацию. Попробуйте снова.");
      setLoadingRole(null);
    }
  }

  return (
    <div className="admin-login flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="admin-login__card card-surface flex w-full max-w-md flex-col gap-4 bg-[var(--card)] p-8">
        <h1 className="admin-login__title text-2xl font-bold text-[var(--foreground)]">
          Админ вход (Учебный PKCE)
        </h1>
        <p className="text-sm text-gray-600">
          Выберите роль, чтобы запустить локальный поток Authorization Code + PKCE.
        </p>

        {error && <div className="admin-login__error text-sm text-red-500">{error}</div>}

        <div className="admin-login__form flex flex-col gap-3">
          <Button
            className="admin-login__button"
            disabled={loadingRole !== null}
            onClick={() => startLogin("manager")}
          >
            {loadingRole === "manager" ? "Запуск..." : roleLabels.manager}
          </Button>
          <Button
            variant="outline"
            className="admin-login__button"
            disabled={loadingRole !== null}
            onClick={() => startLogin("viewer")}
          >
            {loadingRole === "viewer" ? "Запуск..." : roleLabels.viewer}
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Роль `viewer` не может открывать разделы категорий и товаров.
        </p>
        <Link href="/" className="text-xs text-gray-500 underline">
          Вернуться на сайт
        </Link>
      </div>
    </div>
  );
}
