"use client"

import { useState } from "react"
import { useUserContext } from "../contexts/UserContext"

const AddTeamForm = ({ onClose }) => {
  const { users, addTeam } = useUserContext()
  const [teamName, setTeamName] = useState("")
  const [userIdOne, setUserIdOne] = useState("")
  const [userIdTwo, setUserIdTwo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!teamName.trim()) {
      setError("Team name is required")
      return
    }

    if (!userIdOne) {
      setError("Please select the first team member")
      return
    }

    if (!userIdTwo) {
      setError("Please select the second team member")
      return
    }

    if (userIdOne === userIdTwo) {
      setError("Team members must be different users")
      return
    }

    setIsSubmitting(true)

    try {
      await addTeam({
        userIdOne,
        userIdTwo,
        teamName: teamName.trim(),
      })
      onClose()
    } catch (err) {
      setError(err.message || "Failed to create team")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get available users for selection
  const availableUsers = users.filter(user => user.id !== userIdOne && user.id !== userIdTwo)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
          Team Name
        </label>
        <input
          type="text"
          id="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          placeholder="Enter team name"
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label htmlFor="userIdOne" className="block text-sm font-medium text-gray-700 mb-2">
          First Team Member
        </label>
        <select
          id="userIdOne"
          value={userIdOne}
          onChange={(e) => setUserIdOne(e.target.value)}
          className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 12px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '16px',
            paddingRight: '3rem'
          }}
          disabled={isSubmitting}
          required
        >
          <option value="">Select first member</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} {user.gamerTag && `(@${user.gamerTag})`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="userIdTwo" className="block text-sm font-medium text-gray-700 mb-2">
          Second Team Member
        </label>
        <select
          id="userIdTwo"
          value={userIdTwo}
          onChange={(e) => setUserIdTwo(e.target.value)}
          className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 12px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '16px',
            paddingRight: '3rem'
          }}
          disabled={isSubmitting}
          required
        >
          <option value="">Select second member</option>
          {users
            .filter(user => user.id !== userIdOne)
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} {user.gamerTag && `(@${user.gamerTag})`}
              </option>
            ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base"
        >
          {isSubmitting ? "Creating..." : "Create Team"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddTeamForm 