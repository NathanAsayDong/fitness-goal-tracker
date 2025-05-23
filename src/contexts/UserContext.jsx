"use client"

import { createContext, useState, useContext, useEffect } from "react"

const UserContext = createContext()

export const useUserContext = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("fitnessAppUsers")
    return savedUsers ? JSON.parse(savedUsers) : []
  })

  useEffect(() => {
    localStorage.setItem("fitnessAppUsers", JSON.stringify(users))
  }, [users])

  const addUser = (newUser) => {
    const userId = Date.now().toString()
    setUsers([
      ...users,
      {
        id: userId,
        name: newUser.name,
        avatar:
          newUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`,
        goals: {
          eating: { description: newUser.eatingGoal, count: 0, target: 7 },
          fitness: { description: newUser.fitnessGoal, count: 0, target: 7 },
          emotional: { description: newUser.emotionalGoal, count: 0, target: 7 },
          spiritual: { description: newUser.spiritualGoal, count: 0, target: 7 },
        },
        history: [],
      },
    ])
    return userId
  }

  const updateGoal = (userId, category, goal) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            goals: {
              ...user.goals,
              [category]: {
                ...user.goals[category],
                description: goal,
              },
            },
          }
        }
        return user
      }),
    )
  }

  const incrementGoalCount = (userId, category) => {
    const today = new Date().toISOString().split("T")[0]

    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          // Check if already incremented today
          const alreadyIncremented = user.history.some((entry) => entry.date === today && entry.category === category)

          if (alreadyIncremented) {
            return user
          }

          return {
            ...user,
            goals: {
              ...user.goals,
              [category]: {
                ...user.goals[category],
                count: user.goals[category].count + 1,
              },
            },
            history: [...user.history, { date: today, category, action: "increment" }],
          }
        }
        return user
      }),
    )
  }

  const resetGoalCount = (userId, category) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            goals: {
              ...user.goals,
              [category]: {
                ...user.goals[category],
                count: 0,
              },
            },
          }
        }
        return user
      }),
    )
  }

  const updateGoalTarget = (userId, category, target) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            goals: {
              ...user.goals,
              [category]: {
                ...user.goals[category],
                target: Number.parseInt(target, 10),
              },
            },
          }
        }
        return user
      }),
    )
  }

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateGoal,
        incrementGoalCount,
        resetGoalCount,
        updateGoalTarget,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
