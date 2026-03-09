"use client";

import Link from "next/link";
import { useState } from "react";
import { DEMO_ACCOUNTS, DEMO_OAUTH_CLIENT_ID, PKCE_STORAGE_KEYS } from "@/lib/auth/constants";
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
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null);

  async function startLogin(accountId: keyof typeof DEMO_ACCOUNTS) {
    setLoadingAccount(accountId);
    setError("");

    try {
      const account = DEMO_ACCOUNTS[accountId];
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
        role: account.role,
        account: accountId
      });

      window.location.href = `/api/mock-oauth/authorize?${params.toString()}`;
    } catch {
      setError("Не удалось начать PKCE-авторизацию. Попробуйте снова.");
      setLoadingAccount(null);
    }
  }

  return (
    <div className="admin-login flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="admin-login__card card-surface flex w-full max-w-md flex-col gap-4 bg-[var(--card)] p-8">
        <h1 className="admin-login__title text-2xl font-bold text-[var(--foreground)]">
          Админ вход (Учебный PKCE)
        </h1>
        <p className="text-sm text-gray-600">
          Выберите аккаунт, чтобы запустить локальный поток Authorization Code + PKCE.
        </p>

        {error && <div className="admin-login__error text-sm text-red-500">{error}</div>}

        <div className="admin-login__form flex flex-col gap-3">
          <Button
            className="admin-login__button"
            disabled={loadingAccount !== null}
            onClick={() => startLogin("adminMain")}
          >
            {loadingAccount === "adminMain" ? "Запуск..." : "Админ (доступ ко всем сущностям)"}
          </Button>
          <Button
            variant="outline"
            className="admin-login__button"
            disabled={loadingAccount !== null}
            onClick={() => startLogin("userA")}
          >
            {loadingAccount === "userA" ? "Запуск..." : "Пользователь A (свои сущности)"}
          </Button>
          <Button
            variant="outline"
            className="admin-login__button"
            disabled={loadingAccount !== null}
            onClick={() => startLogin("userB")}
          >
            {loadingAccount === "userB" ? "Запуск..." : "Пользователь B (свои сущности)"}
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Пользователь видит и изменяет только свои категории и товары.
        </p>
        <Link href="/" className="text-xs text-gray-500 underline">
          Вернуться на сайт
        </Link>
      </div>
    </div>
  );
}
