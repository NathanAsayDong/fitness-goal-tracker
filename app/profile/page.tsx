"use client"

import { User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if there's a cached user
    const cachedUserId = localStorage.getItem('selectedUserId')
    
    if (cachedUserId) {
      // Redirect to the cached user's profile
      router.push(`/profile/${cachedUserId}`)
    } else {
      // No cached user, show loading state briefly then redirect to leaderboard with selection
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="text-center py-6">
      <User className="mx-auto text-gray-400 mb-4" size={64} />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Select Your Profile</h1>
      <p className="text-gray-600 mb-6">
        Use the "Profile" button in the navigation to select your user account.
      </p>
      <button
        onClick={() => router.push('/')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to Leaderboard
      </button>
    </div>
  )
} 