'use client';

import useAuth from "@/data/hooks/useAuth";

export default function Home() {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      HOME

      <button onClick={logout} className="bg-green-600 p-5 rounded-md text-sm font-bold">
        Logout
      </button>
    </div>
  );
}