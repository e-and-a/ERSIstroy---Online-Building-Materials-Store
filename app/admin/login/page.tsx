"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ошибка");
      setLoading(false);
      return;
    }

    // Старый рабочий вариант: показывал {"success":true}
    // и потом ты вручную переходил в админку
    window.location.href = "/admin/orders";
  }

  return (
    <div className="admin-login flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="admin-login__card card-surface flex w-full max-w-md flex-col gap-4 bg-[var(--card)] p-8">
        <h1 className="admin-login__title text-2xl font-bold text-[var(--foreground)]">Админ вход</h1>

        {error && <div className="admin-login__error text-sm text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login__form flex flex-col gap-4">
          <Input name="login" placeholder="Логин" className="admin-login__input" required />
          <Input
            name="password"
            type="password"
            placeholder="Пароль"
            className="admin-login__input"
            required
          />

          <Button disabled={loading} className="admin-login__button">
            {loading ? "Входим..." : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
