"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Dashboard() {
  const { user, error, isLoading } = useUser();

  if(isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <h1>Dashboard</h1>
        <p>{user.name}</p>
        <p>{user.nickname}</p>
    </div>
  )
}