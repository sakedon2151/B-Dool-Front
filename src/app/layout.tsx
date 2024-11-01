import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import ReactQueryProvider from "./components/common/ReactQueryProvider";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "B-DOOL",
  description: "가볍게 사용하는 협업 메신저",
  icons: {
    icon: [
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        url: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/x-icon',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
