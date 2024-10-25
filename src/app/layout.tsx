import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import ReactQueryProvider from "./components/common/ReactQueryProvider";
import { ThemeProvider } from "next-themes";

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
      <body>
        <ThemeProvider enableSystem={true} attribute="data-theme" defaultTheme="light">
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
