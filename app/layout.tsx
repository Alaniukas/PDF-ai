import type { Metadata } from "next";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  title: "DI darbo gidas | Asmeninis PDF Jūsų darbui",
  description:
    "Vadovas spaudžia naudoti DI, o Jūs nežinote, nuo ko pradėti? Gaukite asmeninį PDF gidą su žingsniais, programų naudojimu ir ekrano paaiškinimais — be techninio žargono.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <head>
        {process.env.NODE_ENV === "development" && (
          <link
            rel="stylesheet"
            href="/_next/static/css/app/layout.css"
            precedence="default"
          />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <AnalyticsProvider />
        <CookieConsent />
      </body>
    </html>
  );
}
