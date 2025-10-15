"use client"; // necessário se estiver usando Next.js App Router

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useToken(redirectToLogin = true) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(null);
      if (redirectToLogin) {
        router.push("/login.html"); // redireciona automaticamente
      }
    }
  }, [redirectToLogin, router]);

  const destroyToken = () => {
    localStorage.removeItem("token");
    setToken(null);
    if (redirectToLogin) router.push("/login.html"); // logout redireciona
  };

  return { token, destroyToken };
}
