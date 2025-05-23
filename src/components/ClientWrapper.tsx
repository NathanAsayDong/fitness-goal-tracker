"use client"

import Navbar from "@/src/components/Navbar"
import { UserProvider } from "@/src/contexts/UserContext"

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </UserProvider>
  )
} 