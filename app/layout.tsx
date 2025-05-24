import ClientWrapper from "@/src/components/ClientWrapper"
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Jacked June",
  description: "Compete in the ultimate wellness showdown in June.",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/apple-touch-icon.png', sizes: '1024x1024', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '1024x1024', type: 'image/png' }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/apple-touch-icon.png" sizes="1024x1024" type="image/png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="1024x1024" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jacked June" />
      </head>
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}
