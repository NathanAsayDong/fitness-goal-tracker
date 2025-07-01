"use client"

import { Crown, Plus, Trophy, User, Users, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUserContext } from "../contexts/UserContext"
import AddTeamForm from "./AddTeamForm"
import AddUserForm from "./AddUserForm"

const Leaderboard = () => {
  const { users, teams, getUserProgress, getUserScore, getTeamScore, loading, error } = useUserContext()
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [viewMode, setViewMode] = useState("users") // "users" or "teams"
  const [confettiPieces, setConfettiPieces] = useState([])

  // Generate confetti pieces
  useEffect(() => {
    const pieces = []
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
      })
    }
    setConfettiPieces(pieces)
  }, [])

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
    <div className="space-y-4 pb-6 relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-2 h-2 opacity-80"
            style={{
              left: `${piece.x}%`,
              backgroundColor: piece.color,
              animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s infinite`
            }}
          />
        ))}
      </div>

      {/* CSS Keyframes for animations */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes crown-glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.7)); }
          50% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1)); }
        }
        @keyframes trophy-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes winner-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { transform: scale(1.02); box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .crown-glow { animation: crown-glow 2s ease-in-out infinite; }
        .trophy-spin { animation: trophy-spin 4s linear infinite; }
        .winner-pulse { animation: winner-pulse 3s ease-in-out infinite; }
        .float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Celebration Banner */}
      <div className="relative z-10 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white text-center py-4 shadow-lg">
        <div className="flex justify-center items-center space-x-2">
          <span className="text-2xl animate-bounce">🎉</span>
          <h2 className="text-lg font-bold">COMPETITION COMPLETE!</h2>
          <span className="text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>🏆</span>
        </div>
        <p className="text-sm mt-1 opacity-90">Congratulations to all our amazing participants!</p>
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm border-b z-50">
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <Trophy className="trophy-spin text-yellow-500" size={32} />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
                Final Results - Competition Winners!
              </h1>
              <Trophy className="trophy-spin text-yellow-500" size={32} style={{animationDelay: '2s'}} />
            </div>
            <div className="flex justify-center space-x-4 text-sm">
              <span className="flex items-center">
                <Star className="text-yellow-500 mr-1" size={16} />
                <span className="font-medium">Amazing Effort by Everyone!</span>
              </span>
            </div>
          </div>
          
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
        <div className="relative z-10">
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
                  let cardStyle, rankColor, scoreColor, crownColor, specialClass = ''
                  if (index === 0) {
                    cardStyle = 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50'
                    rankColor = 'text-yellow-600'
                    scoreColor = 'text-yellow-600'
                    crownColor = 'text-yellow-500'
                    specialClass = 'winner-pulse'
                  } else if (index === 1) {
                    cardStyle = 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50'
                    rankColor = 'text-gray-600'
                    scoreColor = 'text-gray-600'
                    crownColor = 'text-gray-500'
                    specialClass = 'float'
                  } else if (index === 2) {
                    cardStyle = 'border-amber-600 bg-gradient-to-r from-amber-50 to-orange-50'
                    rankColor = 'text-amber-700'
                    scoreColor = 'text-amber-700'
                    crownColor = 'text-amber-600'
                    specialClass = 'float'
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
                    className={`bg-white rounded-lg shadow-md border-2 transition-all hover:shadow-lg ${cardStyle} ${specialClass} relative overflow-hidden`}
                  >
                  {/* Celebration Particles for Top 3 */}
                  {index < 3 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute text-lg opacity-70"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${10 + (i % 2) * 70}%`,
                            animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.3}s`
                          }}
                        >
                          {['✨', '🎉', '⭐', '🏆', '🎊'][i]}
                        </div>
                      ))}
                    </div>
                  )}

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
                          {index < 3 && <Crown className={`ml-1 ${crownColor} crown-glow`} size={20} />}
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
                            {index === 0 && <span className="ml-2 text-yellow-500">👑</span>}
                            {index === 1 && <span className="ml-2 text-gray-500">🥈</span>}
                            {index === 2 && <span className="ml-2 text-amber-600">🥉</span>}
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
                            {index < 3 && <span className="ml-1 text-yellow-400">✨</span>}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
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
        <div className="relative z-10">
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
                  let cardStyle, rankColor, scoreColor, crownColor, specialClass = ''
                  if (index === 0) {
                    cardStyle = 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50'
                    rankColor = 'text-yellow-600'
                    scoreColor = 'text-yellow-600'
                    crownColor = 'text-yellow-500'
                    specialClass = 'winner-pulse'
                  } else if (index === 1) {
                    cardStyle = 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50'
                    rankColor = 'text-gray-600'
                    scoreColor = 'text-gray-600'
                    crownColor = 'text-gray-500'
                    specialClass = 'float'
                  } else if (index === 2) {
                    cardStyle = 'border-amber-600 bg-gradient-to-r from-amber-50 to-orange-50'
                    rankColor = 'text-amber-700'
                    scoreColor = 'text-amber-700'
                    crownColor = 'text-amber-600'
                    specialClass = 'float'
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
                      className={`bg-white rounded-lg shadow-md border-2 transition-all hover:shadow-lg ${cardStyle} ${specialClass} relative overflow-hidden`}
                    >
                    {/* Celebration Particles for Top 3 Teams */}
                    {index < 3 && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute text-lg opacity-70"
                            style={{
                              left: `${20 + i * 15}%`,
                              top: `${10 + (i % 2) * 70}%`,
                              animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                              animationDelay: `${i * 0.3}s`
                            }}
                          >
                            {['✨', '🎉', '⭐', '🏆', '🎊'][i]}
                          </div>
                        ))}
                      </div>
                    )}

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
                            {index < 3 && <Crown className={`ml-1 ${crownColor} crown-glow`} size={20} />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {team.teamName}
                              {index === 0 && <span className="ml-2 text-yellow-500">👑</span>}
                              {index === 1 && <span className="ml-2 text-gray-500">🥈</span>}
                              {index === 2 && <span className="ml-2 text-amber-600">🥉</span>}
                            </h3>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${scoreColor}`}>
                            {team.score}
                            {index < 3 && <span className="ml-1 text-yellow-400">✨</span>}
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
