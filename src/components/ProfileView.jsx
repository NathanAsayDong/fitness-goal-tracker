"use client"

import { AlertTriangle, Check, CheckCircle, Clock, Edit3, Plus, Target, Users, XCircle } from "lucide-react"
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
    getUserScore,
    addGoal, 
    updateGoal,
    addEvent,
    canLogEventForGoal,
    loading,
    error 
  } = useUserContext()
  
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showEditGoal, setShowEditGoal] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState("")
  const [editingGoalId, setEditingGoalId] = useState("")
  const [eventNote, setEventNote] = useState("")
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success" // success, error, warning
  })

  const user = users.find((u) => u.id === userId)
  const userGoals = user ? getUserGoals(userId) : []
  const userEvents = user ? getUserEvents(userId) : []
  const userScore = user ? getUserScore(userId) : 0

  const [goalForm, setGoalForm] = useState({
    goalName: "",
    goalDescription: "",
    goalType: "exercise"
  })

  const [editGoalForm, setEditGoalForm] = useState({
    goalName: "",
    goalDescription: "",
    goalType: ""
  })

  // Get today's events to show what's been completed today
  const today = new Date().toISOString().split('T')[0]
  const todaysEvents = userEvents.filter(event => 
    event.dateTime.split('T')[0] === today
  )

  const isGoalCompletedToday = (goalId) => {
    return !canLogEventForGoal(userId, goalId)
  }

  const showSnackbar = (message, type = "success") => {
    setSnackbar({
      show: true,
      message,
      type
    })
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, show: false }))
    }, 4000)
  }

  const handleUserSwitch = (newUserId) => {
    // Cache the selected user
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedUserId', newUserId)
    }
    setShowUserSelection(false)
    // Navigate to the new user's profile
    window.location.href = `/profile/${newUserId}`
  }

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="space-y-3 pb-6">
        {/* Header Skeleton */}
        <div className="top-0 z-10 p-2">
          <div className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'right' }}>
            <div className="flex items-center space-x-2">
              <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Profile Card Skeleton */}
        <div className="mx-4 bg-gradient-to-r from-gray-300 to-gray-400 p-6 rounded-xl shadow-lg animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-white bg-opacity-30"></div>
            <div className="flex-1">
              <div className="h-6 bg-white bg-opacity-30 rounded mb-2 w-32"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded mb-3 w-24"></div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="h-8 w-8 bg-white bg-opacity-30 rounded mb-1"></div>
                  <div className="h-3 w-8 bg-white bg-opacity-20 rounded"></div>
                </div>
                <div className="text-center">
                  <div className="h-8 w-8 bg-white bg-opacity-30 rounded mb-1"></div>
                  <div className="h-3 w-8 bg-white bg-opacity-20 rounded"></div>
                </div>
                <div className="text-center">
                  <div className="h-8 w-8 bg-white bg-opacity-30 rounded mb-1"></div>
                  <div className="h-3 w-8 bg-white bg-opacity-20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Section Skeleton */}
        <div className="mx-4">
          <div className="flex items-center mb-3">
            <div className="h-5 w-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex items-center mb-2">
                  <div className="h-6 w-6 bg-gray-300 rounded mr-2"></div>
                  <div className="h-5 w-24 bg-gray-300 rounded"></div>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
                <div className="flex justify-center">
                  <div className="h-8 w-28 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="mx-4">
          <div className="flex items-center mb-3">
            <div className="h-5 w-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border rounded-lg p-4 shadow-sm animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-3 w-12 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

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
      const result = await addGoal({
        userId: userId,
        goalName: goalForm.goalName,
        goalDescription: goalForm.goalDescription,
        goalType: goalForm.goalType
      })
      
      if (result.success) {
        setGoalForm({ goalName: "", goalDescription: "", goalType: "exercise" })
        setShowAddGoal(false)
        showSnackbar(result.message, 'success')
      } else {
        // Handle duplicate or other errors with appropriate snackbar type
        const snackbarType = result.type === 'duplicate' ? 'warning' : 'error'
        showSnackbar(result.message, snackbarType)
      }
    } catch (err) {
      console.error('Failed to add goal:', err)
      showSnackbar('Failed to add goal. Please try again later.', 'error')
    }
  }

  const handleMarkComplete = (goalId) => {
    // Check if goal can be logged for today
    if (!canLogEventForGoal(userId, goalId)) {
      console.log('Goal already completed today')
      return
    }
    setSelectedGoalId(goalId)
    setShowEventForm(true)
  }

  const handleSubmitEvent = async (e) => {
    e.preventDefault()
    
    // Double-check that we can still log an event for this goal today
    if (!canLogEventForGoal(userId, selectedGoalId)) {
      console.error('Cannot log event: Goal already completed today')
      setShowEventForm(false)
      setEventNote("")
      setSelectedGoalId("")
      return
    }
    
    try {
      await addEvent({
        userId: userId,
        goalId: selectedGoalId,
        note: eventNote,
        dateTime: new Date().toISOString()
      })
      setEventNote("")
      setSelectedGoalId("")
      setShowEventForm(false)
      showSnackbar('Event logged successfully!')
    } catch (err) {
      console.error('Failed to add event:', err)
      showSnackbar('Failed to log event. Please try again later.', 'error')
    }
  }

  const handleEditGoal = (goal) => {
    setEditingGoalId(goal.id)
    setEditGoalForm({
      goalName: goal.goalName,
      goalDescription: goal.goalDescription,
      goalType: goal.goalType
    })
    setShowEditGoal(true)
  }

  const handleUpdateGoal = async (e) => {
    e.preventDefault()
    try {
      await updateGoal(editingGoalId, {
        goalName: editGoalForm.goalName,
        goalDescription: editGoalForm.goalDescription
      })
      setEditGoalForm({ goalName: "", goalDescription: "", goalType: "" })
      setEditingGoalId("")
      setShowEditGoal(false)
      showSnackbar('Goal updated successfully!')
    } catch (err) {
      console.error('Failed to update goal:', err)
      showSnackbar('Failed to update goal. Please try again later.', 'error')
    }
  }

  const goalTypeOptions = [
    { value: "diet", label: "Diet", emoji: "🥗", color: "bg-green-100 border-green-300" },
    { value: "exercise", label: "Exercise", emoji: "💪", color: "bg-blue-100 border-blue-300" },
    { value: "emotional", label: "Emotional", emoji: "😌", color: "bg-purple-100 border-purple-300" },
    { value: "spiritual", label: "Spiritual", emoji: "🧘", color: "bg-yellow-100 border-yellow-300" }
  ]

  const getGoalTypeStyle = (goalType) => {
    const option = goalTypeOptions.find(opt => opt.value === goalType)
    return option ? option : goalTypeOptions[1] // default to exercise
  }

  return (
    <div className="space-y-3 pb-6">
      {/* Header */}
      <div className="top-0 z-10 p-2">
        <div className="flex justify-between" style={{ display: 'flex', justifyContent: 'right' }}>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUserSelection(true)}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
            >
              <Users size={16} className="mr-1" />
              Switch User
            </button>
            <button
              onClick={() => setShowAddGoal(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Goal
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Snackbar */}
      {snackbar.show && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          snackbar.type === 'success' ? 'bg-green-500 text-white' :
          snackbar.type === 'warning' ? 'bg-yellow-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {snackbar.type === 'success' && <CheckCircle size={20} />}
            {snackbar.type === 'warning' && <AlertTriangle size={20} />}
            {snackbar.type === 'error' && <XCircle size={20} />}
            <span>{snackbar.message}</span>
            <button
              onClick={() => setSnackbar(prev => ({ ...prev, show: false }))}
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* User Profile Card */}
      <div className="mx-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-blue-100">{user.gamerTag && `@${user.gamerTag}`}</p>
            <div className="mt-2 flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{userScore}</div>
                <div className="text-xs text-blue-200">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{todaysEvents.length}</div>
                <div className="text-xs text-blue-200">Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userGoals.length}</div>
                <div className="text-xs text-blue-200">Goals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="mx-4">
        <h2 className="text-lg font-bold mb-3 flex items-center">
          <Target className="mr-2 text-blue-600" size={20} />
          Daily Goals
        </h2>
        
        {userGoals.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Target className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-500 mb-4">No goals yet. Add your first goal to get started!</p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userGoals.map((goal) => {
              const goalStyle = getGoalTypeStyle(goal.goalType)
              const hasCompletedToday = isGoalCompletedToday(goal.id)
              
              return (
                <div
                  key={goal.id}
                  className={`border-2 rounded-lg p-4 transition-all ${goalStyle.color}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{goalStyle.emoji}</span>
                      <h3 className="font-semibold text-gray-800">{goal.goalName}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {hasCompletedToday && (
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Check size={12} className="mr-1" />
                          Done
                        </div>
                      )}
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-1 text-gray-500 hover:text-gray-700 transition"
                        title="Edit goal"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{goal.goalDescription}</p>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleMarkComplete(goal.id)}
                      disabled={hasCompletedToday}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        hasCompletedToday
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                      }`}
                    >
                      {hasCompletedToday ? '✓ Completed Today' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mx-4">
        <h2 className="text-lg font-bold mb-3 flex items-center">
          <Clock className="mr-2 text-green-600" size={20} />
          Recent Activity
        </h2>
        
        {userEvents.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No activities logged yet. Mark your first goal complete to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userEvents
              .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
              .slice(0, 5)
              .map((event) => {
                const goal = userGoals.find(g => g.id === event.goalId)
                const goalStyle = goal ? getGoalTypeStyle(goal.goalType) : goalTypeOptions[1]
                const eventDate = new Date(event.dateTime)
                const isToday = event.dateTime.split('T')[0] === today
                
                return (
                  <div key={event.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{goalStyle.emoji}</span>
                        <div>
                          <p className="font-medium text-gray-800">{event.note}</p>
                          <p className="text-sm text-gray-600">Goal: {goal?.goalName || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {isToday ? 'Today' : eventDate.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Goal</h2>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {goalTypeOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setGoalForm({...goalForm, goalType: option.value})}
                        className={`p-3 rounded-lg border-2 transition text-left ${
                          goalForm.goalType === option.value 
                            ? option.color + ' border-current' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-lg mb-1">{option.emoji}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                  <input
                    type="text"
                    required
                    value={goalForm.goalName}
                    onChange={(e) => setGoalForm({...goalForm, goalName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Run 3 miles daily"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={goalForm.goalDescription}
                    onChange={(e) => setGoalForm({...goalForm, goalDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Describe your goal in detail..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {showEditGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Goal</h2>
              <form onSubmit={handleUpdateGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {goalTypeOptions.map(option => {
                      const isSelected = editGoalForm.goalType === option.value
                      return (
                        <div
                          key={option.value}
                          className={`p-3 rounded-lg border-2 transition text-left ${
                            isSelected 
                              ? option.color + ' border-current' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="text-lg mb-1">{option.emoji}</div>
                          <div className="text-sm font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500 mt-1">(Cannot be changed)</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                  <input
                    type="text"
                    required
                    value={editGoalForm.goalName}
                    onChange={(e) => setEditGoalForm({...editGoalForm, goalName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Run 3 miles daily"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={editGoalForm.goalDescription}
                    onChange={(e) => setEditGoalForm({...editGoalForm, goalDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Describe your goal in detail..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditGoal(false)
                      setEditGoalForm({ goalName: "", goalDescription: "", goalType: "" })
                      setEditingGoalId("")
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Update Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Mark Goal Complete</h2>
              <form onSubmit={handleSubmitEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal: {userGoals.find(g => g.id === selectedGoalId)?.goalName}
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How did you complete this goal today?
                  </label>
                  <textarea
                    required
                    value={eventNote}
                    onChange={(e) => setEventNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows="3"
                    placeholder="Describe what you did to complete this goal..."
                    autoFocus
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventForm(false)
                      setEventNote("")
                      setSelectedGoalId("")
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Complete Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Selection Modal */}
      {showUserSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Users className="mr-2" size={24} />
                Switch to User Profile
              </h2>
              
              <div className="space-y-3">
                {users.map((userOption) => (
                  <button
                    key={userOption.id}
                    onClick={() => handleUserSwitch(userOption.id)}
                    disabled={userOption.id === userId}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      userOption.id === userId
                        ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-not-allowed'
                        : 'bg-gray-50 hover:bg-blue-50 border-transparent hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        userOption.id === userId ? 'bg-blue-600' : 'bg-blue-500'
                      }`}>
                        {userOption.firstName.charAt(0)}{userOption.lastName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {userOption.firstName} {userOption.lastName}
                          {userOption.id === userId && ' (Current)'}
                        </h3>
                        {userOption.gamerTag && (
                          <p className="text-sm text-gray-500">@{userOption.gamerTag}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setShowUserSelection(false)}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileView
