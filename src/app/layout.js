import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MyNavbar from "@/components/my-navbar";
import { Toaster } from "@/components/ui/sonner"
import { Auth0Provider } from "@auth0/nextjs-auth0/client";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kamil Bozkurt Portfolio",
  description: "Portfolio of Kamil Bozkurt - Full Stack Developer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MyNavbar />
        <Auth0Provider>
        {children}
        </Auth0Provider>
        <Toaster />
      </body>
    </html>
  );
}
