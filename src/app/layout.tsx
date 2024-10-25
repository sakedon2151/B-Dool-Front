import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import ReactQueryProvider from "./components/common/ReactQueryProvider";
import { ThemeProvider } from "next-themes";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "B-DOOL",
  description: "가볍게 사용하는 협업 메신저",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>B-DOOL</title>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </head>
      <body >
        <ThemeProvider enableSystem={true} attribute="data-theme" defaultTheme="light">
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
