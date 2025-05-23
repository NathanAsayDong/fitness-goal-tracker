"use client"

import { useState } from "react"
import { useUserContext } from "../contexts/UserContext"
import { Edit, Check, X } from "lucide-react"

const GoalCard = ({ userId, category, title, icon, goal, color, progressColor }) => {
  const { incrementGoalCount, updateGoal, updateGoalTarget } = useUserContext()
  const [isEditing, setIsEditing] = useState(false)
  const [editedGoal, setEditedGoal] = useState(goal.description)
  const [editedTarget, setEditedTarget] = useState(goal.target)

  const progressPercent = Math.min(100, Math.round((goal.count / goal.target) * 100))

  const handleIncrement = () => {
    incrementGoalCount(userId, category)
  }

  const handleSave = () => {
    updateGoal(userId, category, editedGoal)
    updateGoalTarget(userId, category, editedTarget)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedGoal(goal.description)
    setEditedTarget(goal.target)
    setIsEditing(false)
  }

  // Check if goal was completed today
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className={`border rounded-lg p-5 ${color}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{icon}</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-gray-700">
            <Edit size={18} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Description</label>
            <input
              type="text"
              value={editedGoal}
              onChange={(e) => setEditedGoal(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Target</label>
            <input
              type="number"
              min="1"
              max="100"
              value={editedTarget}
              onChange={(e) => setEditedTarget(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Check size={16} className="mr-1" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <X size={16} className="mr-1" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-4">{goal.description}</p>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>
                {goal.count} / {goal.target} days this week
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`${progressColor} h-2.5 rounded-full`} style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <button
            onClick={handleIncrement}
            className="w-full py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Complete Today
          </button>
        </>
      )}
    </div>
  )
}

export default GoalCard
