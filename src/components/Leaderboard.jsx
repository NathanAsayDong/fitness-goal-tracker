"use client"

import { useUserContext } from "../contexts/UserContext"
import { Link } from "react-router-dom"
import { useState } from "react"
import AddUserForm from "./AddUserForm"

const Leaderboard = () => {
  const { users } = useUserContext()
  const [showAddUser, setShowAddUser] = useState(false)

  // Calculate total progress percentage for each user
  const usersWithProgress = users
    .map((user) => {
      const categories = ["eating", "fitness", "emotional", "spiritual"]
      const totalCount = categories.reduce((sum, cat) => sum + user.goals[cat].count, 0)
      const totalTarget = categories.reduce((sum, cat) => sum + user.goals[cat].target, 0)
      const progressPercent = totalTarget > 0 ? Math.round((totalCount / totalTarget) * 100) : 0

      return {
        ...user,
        progressPercent,
      }
    })
    .sort((a, b) => b.progressPercent - a.progressPercent)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Goal Tracker Leaderboard</h1>
        <button
          onClick={() => setShowAddUser(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No users yet. Add your first user to get started!</p>
          <button
            onClick={() => setShowAddUser(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add User
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersWithProgress.map((user, index) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${user.progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{user.progressPercent}% Complete</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link to={`/profile/${user.id}`} className="text-blue-600 hover:text-blue-900">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <AddUserForm onClose={() => setShowAddUser(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
