'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/data/hooks/useAuth";
import Carregando from "@/components/shared/Carregando";

export default function LoginQRCode() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginQr } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      loginQr(token);  
    } else {
      router.push("/login");  
    }
  }, [searchParams, router, loginQr]);

  return <Carregando />; 
}
