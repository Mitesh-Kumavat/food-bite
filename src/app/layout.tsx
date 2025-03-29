import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
  weight: ['400', '700', '100', '200', '300', '500', '600', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Sample app with basic setup",
  description: "Setup with Tailwind CSS, TypeScript, Next.js, MongoDb, Authencation, and ShadCn",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${poppins.className} antialiased `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
