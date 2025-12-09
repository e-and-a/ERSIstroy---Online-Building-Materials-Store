"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await fetch("/admin/logout", { method: "POST", credentials: "include" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="admin-header__logout"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? "Выходим..." : "Выйти"}
    </Button>
  );
}

