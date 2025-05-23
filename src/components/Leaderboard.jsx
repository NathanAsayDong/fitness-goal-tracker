"use client"

import Link from "next/link"
import { useState } from "react"
import { useUserContext } from "../contexts/UserContext"
import AddTeamForm from "./AddTeamForm"

const Leaderboard = () => {
  const { users, teams, getUserProgress, loading, error } = useUserContext()
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [viewMode, setViewMode] = useState("users") // "users" or "teams"

  // Calculate progress for each user and sort
  const usersWithProgress = users
    .map((user) => ({
      ...user,
      progressPercent: getUserProgress(user.id),
    }))
    .sort((a, b) => b.progressPercent - a.progressPercent)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error loading data: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Goal Tracker Leaderboard</h1>
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("users")}
              className={`px-4 py-2 rounded-md transition ${
                viewMode === "users"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setViewMode("teams")}
              className={`px-4 py-2 rounded-md transition ${
                viewMode === "teams"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Teams
            </button>
          </div>
          
          <button
            onClick={() => setShowAddTeam(true)}
            disabled={users.length < 2}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title={users.length < 2 ? "Need at least 2 users to create a team" : "Create a new team"}
          >
            Add Team
          </button>
        </div>
      </div>

      {/* Users View */}
      {viewMode === "users" && (
        <>
          {users.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No users yet. Users need to be added to get started!</p>
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
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.gamerTag && `@${user.gamerTag}`}
                            </div>
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
                        <Link href={`/profile/${user.id}`} className="text-blue-600 hover:text-blue-900">
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Teams View */}
      {viewMode === "teams" && (
        <>
          {(!teams || teams.length === 0) ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No teams yet. Create your first team to get started!</p>
              {users.length >= 2 && (
                <button
                  onClick={() => setShowAddTeam(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Create Team
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teams.map((team) => {
                    const userOne = users.find(u => u.id === team.userIdOne)
                    const userTwo = users.find(u => u.id === team.userIdTwo)
                    return (
                      <tr key={team.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{team.teamName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            {userOne && (
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                                  {userOne.firstName.charAt(0)}{userOne.lastName.charAt(0)}
                                </div>
                                <span className="ml-2 text-sm text-gray-900">
                                  {userOne.firstName} {userOne.lastName}
                                </span>
                              </div>
                            )}
                            <span className="text-gray-400">&</span>
                            {userTwo && (
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                                  {userTwo.firstName.charAt(0)}{userTwo.lastName.charAt(0)}
                                </div>
                                <span className="ml-2 text-sm text-gray-900">
                                  {userTwo.firstName} {userTwo.lastName}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(team.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showAddTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Team</h2>
            <AddTeamForm onClose={() => setShowAddTeam(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
