import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusFlow — AI Görev & Odaklanma Asistanı",
  description:
    "Modern dark mode Kanban, Pomodoro ve AI performans koçu ile odaklanın.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FocusFlow",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b111e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
