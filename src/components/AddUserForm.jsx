"use client"

import { useState } from "react"
import { useUserContext } from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"

const AddUserForm = ({ onClose }) => {
  const { addUser } = useUserContext()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    eatingGoal: "",
    fitnessGoal: "",
    emotionalGoal: "",
    spiritualGoal: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userId = addUser(formData)
    onClose()
    navigate(`/profile/${userId}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="eatingGoal" className="block text-sm font-medium text-gray-700">
          Eating Goal
        </label>
        <input
          type="text"
          id="eatingGoal"
          name="eatingGoal"
          required
          value={formData.eatingGoal}
          onChange={handleChange}
          placeholder="e.g., Eat 5 servings of vegetables daily"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-700">
          Fitness Goal
        </label>
        <input
          type="text"
          id="fitnessGoal"
          name="fitnessGoal"
          required
          value={formData.fitnessGoal}
          onChange={handleChange}
          placeholder="e.g., Exercise for 30 minutes daily"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="emotionalGoal" className="block text-sm font-medium text-gray-700">
          Emotional Goal
        </label>
        <input
          type="text"
          id="emotionalGoal"
          name="emotionalGoal"
          required
          value={formData.emotionalGoal}
          onChange={handleChange}
          placeholder="e.g., Practice mindfulness for 10 minutes daily"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="spiritualGoal" className="block text-sm font-medium text-gray-700">
          Spiritual Goal
        </label>
        <input
          type="text"
          id="spiritualGoal"
          name="spiritualGoal"
          required
          value={formData.spiritualGoal}
          onChange={handleChange}
          placeholder="e.g., Read spiritual text for 15 minutes daily"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add User
        </button>
      </div>
    </form>
  )
}

export default AddUserForm
