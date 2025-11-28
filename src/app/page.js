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
import MyHeroSection from "@/components/my-hero-section";
import ProjectPreview from "@/components/project-preview";
import ContactForm from "@/components/contact-form";

export default function Home() {
  return (
    <div>
      <MyHeroSection />
      <ProjectPreview count={3} />
      <ContactForm />
    </div>
  );
}
