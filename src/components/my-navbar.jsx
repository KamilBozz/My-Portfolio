import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import Link from "next/link";

export default function MyNavbar() {
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
            <Link href="/login">Login</Link>
        </NavigationMenuLink>
        </NavigationMenuItem>
    </NavigationMenuList>
    </NavigationMenu>
</div>
)
}