import ClientWrapper from "@/src/components/ClientWrapper"
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Fitness Goal Tracker",
  description: "Track and share your fitness goals",
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}
