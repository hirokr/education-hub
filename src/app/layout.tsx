import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/global/Header";
 
const openSans = Open_Sans({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Education and Career HUB",
  description: "A platform for education and career development",
  // icons: {}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${openSans.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Header />
            {children}
            <Toaster position="top-center" richColors closeButton />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
