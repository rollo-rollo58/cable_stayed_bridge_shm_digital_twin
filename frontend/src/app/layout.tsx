import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BridgeScope | Structural Health Research",
  description: "Synthetic cable-stayed bridge health and fatigue research workbench.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-abyss text-white antialiased">{children}</body>
    </html>
  );
}
