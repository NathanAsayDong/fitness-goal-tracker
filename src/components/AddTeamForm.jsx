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
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
          Team Name
        </label>
        <input
          type="text"
          id="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter team name"
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label htmlFor="userIdOne" className="block text-sm font-medium text-gray-700">
          First Team Member
        </label>
        <select
          id="userIdOne"
          value={userIdOne}
          onChange={(e) => setUserIdOne(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
        <label htmlFor="userIdTwo" className="block text-sm font-medium text-gray-700">
          Second Team Member
        </label>
        <select
          id="userIdTwo"
          value={userIdTwo}
          onChange={(e) => setUserIdTwo(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Team"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddTeamForm 