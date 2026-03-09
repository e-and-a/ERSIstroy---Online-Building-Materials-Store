"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEMO_OAUTH_CLIENT_ID, PKCE_STORAGE_KEYS } from "@/lib/auth/constants";

type CallbackStatus = "loading" | "error";

function getErrorText(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Не удалось завершить PKCE-авторизацию.";
}

export default function AdminLoginCallbackPage() {
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    async function finishLogin() {
      try {
        const query = new URLSearchParams(window.location.search);
        const code = query.get("code");
        const state = query.get("state");

        const expectedState = sessionStorage.getItem(PKCE_STORAGE_KEYS.state);
        const codeVerifier = sessionStorage.getItem(PKCE_STORAGE_KEYS.verifier);

        if (!code || !state || !expectedState || !codeVerifier) {
          throw new Error("Не хватает параметров авторизации.");
        }

        if (state !== expectedState) {
          throw new Error("State не совпал. Авторизация отклонена.");
        }

        const redirectUri = `${window.location.origin}/admin/login/callback`;
        const response = await fetch("/api/mock-oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grant_type: "authorization_code",
            code,
            client_id: DEMO_OAUTH_CLIENT_ID,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier
          })
        });

        const data = await response.json();
        if (!response.ok) {
          const description =
            typeof data?.error_description === "string"
              ? data.error_description
              : "Ошибка обмена authorization code.";
          throw new Error(description);
        }

        sessionStorage.removeItem(PKCE_STORAGE_KEYS.state);
        sessionStorage.removeItem(PKCE_STORAGE_KEYS.verifier);

        window.location.replace("/admin/orders");
      } catch (error) {
        setStatus("error");
        setErrorText(getErrorText(error));
      }
    }

    finishLogin();
  }, []);

  return (
    <div className="admin-login-callback flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        {status === "loading" ? (
          <>
            <h1 className="text-xl font-semibold text-gray-900">Завершаем вход</h1>
            <p className="mt-2 text-sm text-gray-600">Идет обмен authorization code по PKCE.</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-gray-900">Ошибка входа</h1>
            <p className="mt-2 text-sm text-red-600">{errorText}</p>
            <Link href="/admin/login" className="mt-4 inline-block text-sm text-gray-700 underline">
              Вернуться на страницу входа
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
