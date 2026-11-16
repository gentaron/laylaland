import Script from "next/script";
import type { Metadata } from "next"
import "./globals.css"
import Navigation from "./navigation"
import Footer from "@/components/Footer"
import { MarketTicker } from "@/platform/market-ticker"

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  title: "Laylaland — Pink Voltage",
  description: "Official landing page for Layla Virel Nova, Pink Voltage.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Script id="pwa-install-worker" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
            navigator.serviceWorker.getRegistration().then((registration) => {
              if (!registration) return navigator.serviceWorker.register('/install-worker.js');
            }).catch(console.error);
          }`}
        </Script>
        <MarketTicker />
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}
