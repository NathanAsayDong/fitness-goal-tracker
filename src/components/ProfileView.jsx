"use client"

import { useParams, Link } from "react-router-dom"
import { useUserContext } from "../contexts/UserContext"
import { ArrowLeft } from "lucide-react"
import GoalCard from "./GoalCard"

const ProfileView = () => {
  const { userId } = useParams()
  const { users } = useUserContext()
  const user = users.find((u) => u.id === userId)

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-4">User not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to Leaderboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Back to Leaderboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 bg-white p-6 rounded-lg shadow">
        <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-20 h-20 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold">{user.name}'s Goals</h1>
          <p className="text-gray-600">Track your progress and stay motivated!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoalCard
          userId={userId}
          category="eating"
          title="Eating Goal"
          icon="🍎"
          goal={user.goals.eating}
          color="bg-green-100 border-green-300"
          progressColor="bg-green-500"
        />

        <GoalCard
          userId={userId}
          category="fitness"
          title="Fitness Goal"
          icon="💪"
          goal={user.goals.fitness}
          color="bg-blue-100 border-blue-300"
          progressColor="bg-blue-500"
        />

        <GoalCard
          userId={userId}
          category="emotional"
          title="Emotional Goal"
          icon="😌"
          goal={user.goals.emotional}
          color="bg-purple-100 border-purple-300"
          progressColor="bg-purple-500"
        />

        <GoalCard
          userId={userId}
          category="spiritual"
          title="Spiritual Goal"
          icon="✨"
          goal={user.goals.spiritual}
          color="bg-amber-100 border-amber-300"
          progressColor="bg-amber-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Activity History</h2>
        {user.history.length === 0 ? (
          <p className="text-gray-500">No activity recorded yet. Start tracking your goals!</p>
        ) : (
          <div className="space-y-2">
            {user.history
              .slice()
              .reverse()
              .slice(0, 10)
              .map((entry, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                  <span>Completed {entry.category} goal</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileView
