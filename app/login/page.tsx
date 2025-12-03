"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (res.ok) {
          router.push("/dashboard");
        } else {
          console.error("Auto-login failed");
          setLoading(false);
        }
      } catch (err) {
        console.error("Auto-login error:", err);
        setLoading(false);
      }
    };

    autoLogin();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-md px-6 py-8 sm:px-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            Korea Trip 2026 Team Login
          </h1>
          <p className="mt-2 text-sm text-gray-500 text-center">
            {loading ? "正在登入中..." : "欢迎访问"}
          </p>

          {loading && (
            <div className="mt-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D28D9]"></div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}





