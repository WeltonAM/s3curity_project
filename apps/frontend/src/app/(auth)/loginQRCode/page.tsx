'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/data/hooks/useAuth";
import Carregando from "@/components/shared/Carregando";

export default function LoginQRCode() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginQr } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const autenticar = async () => {
      const token = searchParams.get("token");

      if (!token) {
        router.push("/login");
        return;
      }

      if (!isAuthenticating) {
        setIsAuthenticating(true);
        try {
          await loginQr(token);  
          router.push("/");
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          router.push("/login");
        }
      }
    };

    autenticar();
  }, [searchParams, router, loginQr, isAuthenticating]);

  return <Carregando />;
}
