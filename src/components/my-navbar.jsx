"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import LogoutButton from "./logout-button";
import LoginButton from "./login-button";

export default function MyNavbar() {
  const { user } = useUser();
  return (
    <div className="flex justify-center py-3 font-mono sticky top">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Resume</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>PDF</NavigationMenuLink>
              <NavigationMenuLink>LATEX</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/projects">Projects</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/projects/new">+</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              {user ? <LogoutButton /> : <LoginButton />}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/dashboard">{user ? user.name || "Dashboard" : "Login"}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
