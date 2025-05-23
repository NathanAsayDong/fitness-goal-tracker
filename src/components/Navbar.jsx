"use client"

import { Link } from "react-router-dom"
import { Home, Plus } from "lucide-react"
import { useState } from "react"
import AddUserForm from "./AddUserForm"

const Navbar = () => {
  const [showAddUser, setShowAddUser] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Goal Tracker</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Home size={20} />
              <span>Home</span>
            </Link>

            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <Plus size={20} />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <AddUserForm onClose={() => setShowAddUser(false)} />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
