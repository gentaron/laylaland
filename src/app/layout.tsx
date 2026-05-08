import type { Metadata } from "next"
import "./globals.css"
import Navigation from "./navigation"

export const metadata: Metadata = {
  title: "Laylaland — Pink Voltage",
  description: "Official landing page for Layla Virel Nova, Pink Voltage.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
