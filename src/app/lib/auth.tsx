// lib/auth.tsx
"use client";
import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!;
  const redirectUri = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI!;

  const onRedirectCallback = (appState: any) => {
    const returnTo = appState?.returnTo || "/";
    router.push(returnTo);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}
