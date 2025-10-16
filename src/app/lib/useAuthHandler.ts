import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthRequired = () => {
      router.push("/auth/login");
    };

    window.addEventListener("auth-required", handleAuthRequired);

    return () => {
      window.removeEventListener("auth-required", handleAuthRequired);
    };
  }, [router]);
}