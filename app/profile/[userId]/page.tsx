"use client"

import ProfileView from "@/src/components/ProfileView"
import { useParams } from "next/navigation"

export default function ProfilePage() {
  const params = useParams()
  const userId = params.userId as string
  
  return <ProfileView userId={userId} />
}

