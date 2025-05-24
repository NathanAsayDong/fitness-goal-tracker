"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { apiService } from "../shared/apiService"
import { calculationService } from "../shared/calculateScores.service"

const UserContext = createContext()

export const useUserContext = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [goals, setGoals] = useState([])
  const [events, setEvents] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load initial data
  useEffect(() => {
    if (isClient) {
      loadInitialData()
    }
  }, [isClient])

  const loadInitialData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [usersData, goalsData, eventsData, teamsData] = await Promise.all([
        apiService.users.getAllUsers(),
        apiService.goals.getAllGoals(),
        apiService.events.getAllEvents(),
        apiService.teams.getAllTeams(),
      ])
      setUsers(usersData)
      setGoals(goalsData)
      setEvents(eventsData)
      setTeams(teamsData)
    } catch (err) {
      setError(err.message)
      console.error('Failed to load initial data:', err)
    } finally {
      setLoading(false)
    }
  }

  // User operations
  const addUser = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const newUser = await apiService.users.createUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        gamerTag: userData.gamerTag,
      })
      setUsers(prev => [...prev, newUser])
      return newUser.id
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (userId, userData) => {
    setLoading(true)
    setError(null)
    try {
      const updatedUser = await apiService.users.updateUser(userId, userData)
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user))
      return updatedUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId) => {
    setLoading(true)
    setError(null)
    try {
      await apiService.users.deleteUser(userId)
      setUsers(prev => prev.filter(user => user.id !== userId))
      // Also remove user's goals and events
      setGoals(prev => prev.filter(goal => goal.userId !== userId))
      setEvents(prev => prev.filter(event => event.userId !== userId))
      // Also remove teams that include this user
      setTeams(prev => prev.filter(team => team.userIdOne !== userId && team.userIdTwo !== userId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Goal operations
  const addGoal = async (goalData) => {
    setLoading(true)
    setError(null)
    try {
      // Check if user already has a goal of this type
      const existingGoal = goals.find(goal => 
        goal.userId === goalData.userId && 
        goal.goalType === goalData.goalType
      )
      
      if (existingGoal) {
        setLoading(false)
        return {
          success: false,
          message: `You already have a ${goalData.goalType} goal set up`,
          type: 'duplicate'
        }
      }

      const newGoal = await apiService.goals.createGoal(goalData)
      setGoals(prev => [...prev, newGoal])
      return {
        success: true,
        goalId: newGoal.id,
        message: 'Goal created successfully!'
      }
    } catch (err) {
      setError(err.message)
      return {
        success: false,
        message: err.message,
        type: 'error'
      }
    } finally {
      setLoading(false)
    }
  }

  const updateGoal = async (goalId, goalData) => {
    setLoading(true)
    setError(null)
    try {
      const updatedGoal = await apiService.goals.updateGoal(goalId, goalData)
      setGoals(prev => prev.map(goal => goal.id === goalId ? updatedGoal : goal))
      return updatedGoal
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteGoal = async (goalId) => {
    setLoading(true)
    setError(null)
    try {
      await apiService.goals.deleteGoal(goalId)
      setGoals(prev => prev.filter(goal => goal.id !== goalId))
      // Also remove goal's events
      setEvents(prev => prev.filter(event => event.goalId !== goalId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const completeGoal = async (goalId) => {
    setLoading(true)
    setError(null)
    try {
      const completedGoal = await apiService.goals.completeGoal(goalId)
      setGoals(prev => prev.map(goal => goal.id === goalId ? completedGoal : goal))
      return completedGoal
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Event operations
  const addEvent = async (eventData) => {
    setLoading(true)
    setError(null)
    try {
      // Check if user can log an event for this goal today
      if (!canLogEventForGoal(eventData.userId, eventData.goalId)) {
        throw new Error('You have already completed this goal today')
      }

      const newEvent = await apiService.events.createEvent(eventData)
      setEvents(prev => [...prev, newEvent])
      return newEvent.id
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateEvent = async (eventId, eventData) => {
    setLoading(true)
    setError(null)
    try {
      const updatedEvent = await apiService.events.updateEvent(eventId, eventData)
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (eventId) => {
    setLoading(true)
    setError(null)
    try {
      await apiService.events.deleteEvent(eventId)
      setEvents(prev => prev.filter(event => event.id !== eventId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Team operations
  const addTeam = async (teamData) => {
    setLoading(true)
    setError(null)
    try {
      const newTeam = await apiService.teams.createTeam(teamData)
      setTeams(prev => [...prev, newTeam])
      return newTeam.id
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTeam = async (teamId, teamData) => {
    setLoading(true)
    setError(null)
    try {
      const updatedTeam = await apiService.teams.updateTeam(teamId, teamData)
      setTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team))
      return updatedTeam
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTeam = async (teamId) => {
    setLoading(true)
    setError(null)
    try {
      await apiService.teams.deleteTeam(teamId)
      setTeams(prev => prev.filter(team => team.id !== teamId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Helper functions to get related data
  const getUserGoals = (userId) => goals.filter(goal => goal.userId === userId)
  
  const getUserEvents = (userId) => events.filter(event => event.userId === userId)
  
  const getGoalEvents = (goalId) => events.filter(event => event.goalId === goalId)

  const getUserTeams = (userId) => teams.filter(team => team.userIdOne === userId || team.userIdTwo === userId)

  const getTeamMembers = (teamId) => {
    const team = teams.find(t => t.id === teamId)
    if (!team) return []
    return users.filter(user => user.id === team.userIdOne || user.id === team.userIdTwo)
  }

  const getUserProgress = (userId) => {
    const userGoals = getUserGoals(userId)
    const completedGoals = userGoals.filter(goal => goal.isCompleted).length
    const totalGoals = userGoals.length
    return totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0
  }

  const getUserScore = (userId) => {
    const userEvents = getUserEvents(userId)
    const userGoals = getUserGoals(userId)
    const user = users.find(u => u.id === userId)
    if (!user) return 0
    return calculationService.calculateUserScore(user, userGoals, userEvents)
  }

  const getTeamScore = (teamId) => {
    const team = teams.find(t => t.id === teamId)
    if (!team) return 0
    
    const teamEvents = events.filter(event => 
      event.userId === team.userIdOne || event.userId === team.userIdTwo
    )
    return calculationService.calculateTeamScore(team, goals, teamEvents)
  }

  const canLogEventForGoal = (userId, goalId) => {
    // Get today's date in local timezone
    const today = new Date()
    const todayString = today.getFullYear() + '-' + 
                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0')
    
    const todaysEvents = events.filter(event => {
      if (event.userId !== userId || event.goalId !== goalId) {
        return false
      }
      
      // Parse the event date and get its date part
      const eventDate = new Date(event.dateTime)
      const eventDateString = eventDate.getFullYear() + '-' + 
                             String(eventDate.getMonth() + 1).padStart(2, '0') + '-' + 
                             String(eventDate.getDate()).padStart(2, '0')
      
      return eventDateString === todayString
    })
    
    // Debug logging
    console.log(`canLogEventForGoal: userId=${userId}, goalId=${goalId}, today=${todayString}, todaysEvents=${todaysEvents.length}`)
    
    return todaysEvents.length === 0
  }

  return (
    <UserContext.Provider
      value={{
        // State
        users,
        goals,
        events,
        teams,
        loading,
        error,
        isClient,
        
        // User operations
        addUser,
        updateUser,
        deleteUser,
        
        // Goal operations
        addGoal,
        updateGoal,
        deleteGoal,
        completeGoal,
        
        // Event operations
        addEvent,
        updateEvent,
        deleteEvent,
        
        // Team operations
        addTeam,
        updateTeam,
        deleteTeam,
        
        // Helper functions
        getUserGoals,
        getUserEvents,
        getGoalEvents,
        getUserTeams,
        getTeamMembers,
        getUserProgress,
        getUserScore,
        getTeamScore,
        canLogEventForGoal,
        
        // Utility
        loadInitialData,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
