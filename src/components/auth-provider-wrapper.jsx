"use client";

import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import MyNavbar from "@/components/my-navbar";

export default function AuthProviderWrapper({ children }) {
  return (
    <Auth0Provider>
      <MyNavbar />
      {children}
    </Auth0Provider>
  );
}

