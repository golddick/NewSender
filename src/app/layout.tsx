import type { Metadata } from "next";
import "../shared/styles/globals.css";
import Providers from "@/shared/utils/Providers";
import { Inter, Playfair_Display } from "next/font/google"
import localFont from "next/font/local";
import { ClerkProvider } from '@clerk/nextjs'

const clashDisplay = localFont({
  src: "../assets/fonts/ClashDisplay-Variable.ttf",
  variable: "--font-clashDisplay",
  weight: "700",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})



export const metadata: Metadata = {
  title: {
    template: "Thenews",
    default: "TheNews - Email Newsletter Marketing Platform",
  },
  icons: {
    icon: "/2logo.jpg",
  },
  description: " Email newsletter merketing platform that helps you create, send, and analyze beautiful newsletters that engage your audience and grow your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${clashDisplay.variable} ${playfair.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
    </ClerkProvider>
  );
}

