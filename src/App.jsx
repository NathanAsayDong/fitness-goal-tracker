import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { UserProvider } from "./contexts/UserContext"
import Leaderboard from "./components/Leaderboard"
import ProfileView from "./components/ProfileView"
import Navbar from "./components/Navbar"

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Leaderboard />} />
              <Route path="/profile/:userId" element={<ProfileView />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
