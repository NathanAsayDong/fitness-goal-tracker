"use client"

import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useUserContext } from "../contexts/UserContext"

const ProfileView = () => {
  const params = useParams()
  const userId = params.userId
  const { 
    users, 
    getUserGoals, 
    getUserEvents, 
    addGoal, 
    addEvent,
    completeGoal,
    loading,
    error 
  } = useUserContext()
  
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState("")
  
  const user = users.find((u) => u.id === userId)
  const userGoals = user ? getUserGoals(userId) : []
  const userEvents = user ? getUserEvents(userId) : []

  const [goalForm, setGoalForm] = useState({
    goalName: "",
    goalDescription: "",
    goalType: "weight_loss"
  })

  const [eventForm, setEventForm] = useState({
    note: "",
    goalId: ""
  })

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-4">User not found</h2>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Leaderboard
        </Link>
      </div>
    )
  }

  const handleAddGoal = async (e) => {
    e.preventDefault()
    try {
      await addGoal({
        userId: userId,
        goalName: goalForm.goalName,
        goalDescription: goalForm.goalDescription,
        goalType: goalForm.goalType
      })
      setGoalForm({ goalName: "", goalDescription: "", goalType: "weight_loss" })
      setShowAddGoal(false)
    } catch (err) {
      console.error('Failed to add goal:', err)
    }
  }

  const handleAddEvent = async (e) => {
    e.preventDefault()
    try {
      await addEvent({
        userId: userId,
        goalId: eventForm.goalId,
        note: eventForm.note,
        dateTime: new Date().toISOString()
      })
      setEventForm({ note: "", goalId: "" })
      setShowAddEvent(false)
    } catch (err) {
      console.error('Failed to add event:', err)
    }
  }

  const handleCompleteGoal = async (goalId) => {
    try {
      await completeGoal(goalId)
    } catch (err) {
      console.error('Failed to complete goal:', err)
    }
  }

  const goalTypeOptions = [
    { value: "weight_loss", label: "Weight Loss" },
    { value: "muscle_gain", label: "Muscle Gain" },
    { value: "endurance", label: "Endurance" },
    { value: "strength", label: "Strength" },
    { value: "flexibility", label: "Flexibility" },
    { value: "nutrition", label: "Nutrition" },
    { value: "mental_health", label: "Mental Health" },
    { value: "other", label: "Other" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Back to Leaderboard
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 bg-white p-6 rounded-lg shadow">
        <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}'s Profile</h1>
          <p className="text-gray-600">{user.email}</p>
          {user.gamerTag && <p className="text-gray-500">@{user.gamerTag}</p>}
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Goals ({userGoals.length})</h2>
          <button
            onClick={() => setShowAddGoal(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={16} className="mr-1" />
            Add Goal
          </button>
        </div>

        {userGoals.length === 0 ? (
          <p className="text-gray-500">No goals yet. Add your first goal to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userGoals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{goal.goalName}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    goal.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {goal.isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{goal.goalDescription}</p>
                <p className="text-xs text-gray-500 mb-3">Type: {goal.goalType}</p>
                {!goal.isCompleted && (
                  <button
                    onClick={() => handleCompleteGoal(goal.id)}
                    disabled={loading}
                    className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Events Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Activity Events ({userEvents.length})</h2>
          <button
            onClick={() => setShowAddEvent(true)}
            disabled={userGoals.length === 0}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <Plus size={16} className="mr-1" />
            Add Event
          </button>
        </div>

        {userEvents.length === 0 ? (
          <p className="text-gray-500">No events recorded yet. Add an event to track your progress!</p>
        ) : (
          <div className="space-y-3">
            {userEvents
              .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
              .slice(0, 10)
              .map((event) => {
                const goal = userGoals.find(g => g.id === event.goalId)
                return (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{event.note}</p>
                        <p className="text-sm text-gray-600">Goal: {goal?.goalName || 'Unknown'}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(event.dateTime).toLocaleDateString()} at{' '}
                        {new Date(event.dateTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Goal</h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Goal Name</label>
                <input
                  type="text"
                  required
                  value={goalForm.goalName}
                  onChange={(e) => setGoalForm({...goalForm, goalName: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  value={goalForm.goalDescription}
                  onChange={(e) => setGoalForm({...goalForm, goalDescription: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Goal Type</label>
                <select
                  value={goalForm.goalType}
                  onChange={(e) => setGoalForm({...goalForm, goalType: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {goalTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Activity Event</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Goal</label>
                <select
                  required
                  value={eventForm.goalId}
                  onChange={(e) => setEventForm({...eventForm, goalId: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Choose a goal...</option>
                  {userGoals.map(goal => (
                    <option key={goal.id} value={goal.id}>{goal.goalName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Activity Note</label>
                <textarea
                  required
                  value={eventForm.note}
                  onChange={(e) => setEventForm({...eventForm, note: e.target.value})}
                  placeholder="Describe what you did..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileView
