"use client"

import { Crown, Plus, Trophy, User, Users } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUserContext } from "../contexts/UserContext"
import AddTeamForm from "./AddTeamForm"
import AddUserForm from "./AddUserForm"

const Leaderboard = () => {
  const { users, teams, getUserProgress, getUserScore, getTeamScore, loading, error } = useUserContext()
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [viewMode, setViewMode] = useState("users") // "users" or "teams"

  // Calculate scores for each user and sort by score
  const usersWithScores = users
    .map((user) => ({
      ...user,
      score: getUserScore(user.id),
      progressPercent: getUserProgress(user.id),
    }))
    .sort((a, b) => b.score - a.score)

  // Calculate scores for each team and sort by score
  const teamsWithScores = teams
    .map((team) => ({
      ...team,
      score: getTeamScore(team.id),
    }))
    .sort((a, b) => b.score - a.score)

  if (loading) {
    return (
      <div className="space-y-4 pb-6">
        {/* Header Skeleton */}
        <div className="sticky top-0 bg-white shadow-sm border-b z-10">
          <div className="p-4">
            <div className="h-8 bg-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-gray-200 animate-pulse mx-1"></div>
                <div className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-gray-200 animate-pulse mx-1"></div>
              </div>
              <div className="w-full sm:w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="mx-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border-2 border-gray-100">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-4 my-8">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Error loading data: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm border-b z-50">
        <div className="p-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-4">
            🏆 Leaderboard
          </h1>
          
          {/* View Toggle and Add Team Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode("users")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md transition text-sm font-medium ${
                  viewMode === "users"
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Trophy className="inline mr-2" size={16} />
                Users
              </button>
              <button
                onClick={() => setViewMode("teams")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md transition text-sm font-medium ${
                  viewMode === "teams"
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Users className="inline mr-2" size={16} />
                Teams
              </button>
            </div>
            
            <button
              onClick={() => {
                if (viewMode === "users") {
                  setShowAddUser(true)
                } else {
                  setShowAddTeam(true)
                }
              }}
              disabled={viewMode === "teams" && users.length < 2}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium w-full sm:w-auto justify-center"
            >
              <Plus size={16} className="mr-2" />
              {viewMode === "users" 
                ? "Add User" 
                : users.length < 2 
                  ? "Need 2+ Users" 
                  : "Add Team"
              }
            </button>
          </div>
        </div>
      </div>

      {/* Users View */}
      {viewMode === "users" && (
        <div className="mx-4">
          {users.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">No users yet. Add users to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {usersWithScores.map((user, index) => {
                  // Determine styling based on rank
                  let cardStyle, rankColor, scoreColor, crownColor
                  if (index === 0) {
                    cardStyle = 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50'
                    rankColor = 'text-yellow-600'
                    scoreColor = 'text-yellow-600'
                    crownColor = 'text-yellow-500'
                  } else if (index === 1) {
                    cardStyle = 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50'
                    rankColor = 'text-gray-600'
                    scoreColor = 'text-gray-600'
                    crownColor = 'text-gray-500'
                  } else if (index === 2) {
                    cardStyle = 'border-amber-600 bg-gradient-to-r from-amber-50 to-orange-50'
                    rankColor = 'text-amber-700'
                    scoreColor = 'text-amber-700'
                    crownColor = 'text-amber-600'
                  } else {
                    cardStyle = 'border-gray-200'
                    rankColor = 'text-gray-600'
                    scoreColor = 'text-blue-600'
                    crownColor = ''
                  }
                  
                  return (
                  <motion.div
                    key={user.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      layout: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      },
                      opacity: { duration: 0.2 },
                      y: { duration: 0.2 }
                    }}
                    className={`bg-white rounded-lg shadow-md border-2 transition-all hover:shadow-lg ${cardStyle} relative overflow-hidden`}
                  >
                  {/* Banner Image Background */}
                  {user.bannerImageUrl && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 rounded-lg"
                      style={{ 
                        backgroundImage: `url(${user.bannerImageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  )}
                  
                  {/* Content overlay */}
                  <div className="relative z-10 p-4">
                    <div className="flex items-center justify-between">
                      {/* Rank and Avatar */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <div className={`text-lg font-bold ${rankColor}`}>
                            #{index + 1}
                          </div>
                          {index < 3 && <Crown className={`ml-1 ${crownColor}`} size={20} />}
                        </div>
                        
                        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                          {user.imageUrl ? (
                            <img 
                              src={user.imageUrl} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className="h-full w-full object-cover rounded-full"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div className={`h-full w-full flex items-center justify-center text-white font-semibold text-sm ${user.imageUrl ? 'hidden' : ''}`}>
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </h3>
                          {user.gamerTag && (
                            <p className="text-sm text-gray-500 truncate">@{user.gamerTag}</p>
                          )}
                        </div>
                      </div>

                      {/* Score and Action */}
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${scoreColor}`} style={{textAlign: 'center'}}>
                            {user.score}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                        
                        {/* <Link
                          href={`/profile/${user.id}`}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          View
                        </Link> */}
                      </div>
                    </div>
                  </div>
                </motion.div>
                )
              })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Teams View */}
      {viewMode === "teams" && (
        <div className="mx-4">
          {(!teams || teams.length === 0) ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">No teams yet. Create your first team!</p>
              {users.length >= 2 && (
                <button
                  onClick={() => setShowAddTeam(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Create First Team
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {teamsWithScores.map((team, index) => {
                  const userOne = users.find(u => u.id === team.userIdOne)
                  const userTwo = users.find(u => u.id === team.userIdTwo)
                  
                  // Determine styling based on rank
                  let cardStyle, rankColor, scoreColor, crownColor
                  if (index === 0) {
                    cardStyle = 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50'
                    rankColor = 'text-yellow-600'
                    scoreColor = 'text-yellow-600'
                    crownColor = 'text-yellow-500'
                  } else if (index === 1) {
                    cardStyle = 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50'
                    rankColor = 'text-gray-600'
                    scoreColor = 'text-gray-600'
                    crownColor = 'text-gray-500'
                  } else if (index === 2) {
                    cardStyle = 'border-amber-600 bg-gradient-to-r from-amber-50 to-orange-50'
                    rankColor = 'text-amber-700'
                    scoreColor = 'text-amber-700'
                    crownColor = 'text-amber-600'
                  } else {
                    cardStyle = 'border-gray-200'
                    rankColor = 'text-gray-600'
                    scoreColor = 'text-green-600'
                    crownColor = ''
                  }
                  
                  return (
                    <motion.div
                      key={team.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        layout: {
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        },
                        opacity: { duration: 0.2 },
                        y: { duration: 0.2 }
                      }}
                      className={`bg-white rounded-lg shadow-md border-2 transition-all hover:shadow-lg ${cardStyle} relative overflow-hidden`}
                    >
                    {/* Banner Image Background */}
                    {(userOne?.bannerImageUrl || userTwo?.bannerImageUrl) && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 rounded-lg"
                        style={{ 
                          backgroundImage: `url(${userOne?.bannerImageUrl || userTwo?.bannerImageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    )}
                    
                    {/* Content overlay */}
                    <div className="relative z-10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        {/* Rank and Team Name */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <div className={`text-lg font-bold ${rankColor}`}>
                              #{index + 1}
                            </div>
                            {index < 3 && <Crown className={`ml-1 ${crownColor}`} size={20} />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {team.teamName}
                            </h3>
                            {/* <p className="text-xs text-gray-500">
                              Created {new Date(team.createdAt).toISOString().split('T')[0]}
                            </p> */}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${scoreColor}`}>
                            {team.score}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>

                      {/* Team Members */}
                      <div className="space-y-2">
                        {userOne && (
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                              {userOne.imageUrl ? (
                                <img 
                                  src={userOne.imageUrl} 
                                  alt={`${userOne.firstName} ${userOne.lastName}`}
                                  className="h-full w-full object-cover rounded-full"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                  }}
                                />
                              ) : null}
                              <div className={`h-full w-full flex items-center justify-center text-white text-xs font-semibold ${userOne.imageUrl ? 'hidden' : ''}`}>
                                {userOne.firstName.charAt(0)}{userOne.lastName.charAt(0)}
                              </div>
                            </div>
                            <span className="text-sm text-gray-700 truncate">
                              {userOne.firstName} {userOne.lastName}
                            </span>
                          </div>
                        )}
                        {userTwo && (
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                              {userTwo.imageUrl ? (
                                <img 
                                  src={userTwo.imageUrl} 
                                  alt={`${userTwo.firstName} ${userTwo.lastName}`}
                                  className="h-full w-full object-cover rounded-full"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                  }}
                                />
                              ) : null}
                              <div className={`h-full w-full flex items-center justify-center text-white text-xs font-semibold ${userTwo.imageUrl ? 'hidden' : ''}`}>
                                {userTwo.firstName.charAt(0)}{userTwo.lastName.charAt(0)}
                              </div>
                            </div>
                            <span className="text-sm text-gray-700 truncate">
                              {userTwo.firstName} {userTwo.lastName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <User className="mr-2" size={24} />
                Add New User
              </h2>
              <AddUserForm onClose={() => setShowAddUser(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Add Team Modal */}
      {showAddTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Users className="mr-2" size={24} />
                Create New Team
              </h2>
              <AddTeamForm onClose={() => setShowAddTeam(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
