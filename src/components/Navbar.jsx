"use client"

import { Home, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useUserContext } from "../contexts/UserContext"
import AddUserForm from "./AddUserForm"

const Navbar = () => {
  const [showAddUser, setShowAddUser] = useState(false)
  const [showUserSelection, setShowUserSelection] = useState(false)
  const { users } = useUserContext()

  // Get cached user from localStorage
  const getCachedUser = () => {
    if (typeof window !== 'undefined') {
      const cachedUserId = localStorage.getItem('selectedUserId')
      return cachedUserId ? users.find(user => user.id === cachedUserId) : null
    }
    return null
  }

  const handleProfileClick = () => {
    const cachedUser = getCachedUser()
    
    if (cachedUser) {
      // If we have a cached user, go directly to their profile
      window.location.href = `/profile/${cachedUser.id}`
    } else {
      // If no cached user, show user selection
      setShowUserSelection(true)
    }
  }

  const handleUserSelect = (userId) => {
    // Cache the selected user
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedUserId', userId)
    }
    setShowUserSelection(false)
    // Navigate to profile
    window.location.href = `/profile/${userId}`
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Family Feud</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Home size={20} />
              <span>Leaderboard</span>
            </Link>

            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <AddUserForm onClose={() => setShowAddUser(false)} />
          </div>
        </div>
      )}

      {/* User Selection Modal */}
      {showUserSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <User className="mr-2" size={24} />
                Select Your Profile
              </h2>
              
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <User className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 mb-4">No users available. Add a user first!</p>
                  <button
                    onClick={() => {
                      setShowUserSelection(false)
                      setShowAddUser(true)
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Add User
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user.id)}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 rounded-lg border-2 border-transparent hover:border-blue-200 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          {user.gamerTag && (
                            <p className="text-sm text-gray-500">@{user.gamerTag}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowUserSelection(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowUserSelection(false)
                    setShowAddUser(true)
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Add New User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
