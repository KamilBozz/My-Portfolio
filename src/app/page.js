// import Image from "next/image";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuIndicator,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   NavigationMenuViewport,
// } from "@/components/ui/navigation-menu"
// import Link from "next/link";
import MyHero from "@/components/my-hero";
import ProjectPreview from "@/components/project-preview";
import ContactForm from "@/components/contact-form";

export default function Home() {
  return (
    <div>
      <MyHero />
      <ProjectPreview count={3} />
      <ContactForm />
    </div>
  );
}
