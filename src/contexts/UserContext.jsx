"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { apiService } from "../shared/apiService"

const UserContext = createContext()

export const useUserContext = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [goals, setGoals] = useState([])
  const [events, setEvents] = useState([])
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
      const [usersData, goalsData, eventsData] = await Promise.all([
        apiService.users.getAllUsers(),
        apiService.goals.getAllGoals(),
        apiService.events.getAllEvents(),
      ])
      setUsers(usersData)
      setGoals(goalsData)
      setEvents(eventsData)
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
      const newGoal = await apiService.goals.createGoal(goalData)
      setGoals(prev => [...prev, newGoal])
      return newGoal.id
    } catch (err) {
      setError(err.message)
      throw err
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

  // Helper functions to get related data
  const getUserGoals = (userId) => goals.filter(goal => goal.userId === userId)
  
  const getUserEvents = (userId) => events.filter(event => event.userId === userId)
  
  const getGoalEvents = (goalId) => events.filter(event => event.goalId === goalId)

  const getUserProgress = (userId) => {
    const userGoals = getUserGoals(userId)
    const completedGoals = userGoals.filter(goal => goal.isCompleted).length
    const totalGoals = userGoals.length
    return totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0
  }

  return (
    <UserContext.Provider
      value={{
        // State
        users,
        goals,
        events,
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
        
        // Helper functions
        getUserGoals,
        getUserEvents,
        getGoalEvents,
        getUserProgress,
        
        // Utility
        loadInitialData,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
