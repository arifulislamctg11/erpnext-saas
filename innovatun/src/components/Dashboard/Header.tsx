"use client"

import {  Shield, Columns2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/use-auth"

export default function Header({ handleLeft }: { handleLeft: () => void }) {
  const { isAdmin } = useAuth()
  const { user, signout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signout()
      navigate("/home")
    } catch (error) {
      // optionally handle error
      console.error(error)
    }
  }

  return (
    <div>
      <header className="h-16 border-b  w-full bg-white   border-border flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <span
              onClick={() => handleLeft()}
              className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Columns2 strokeWidth={1.75} />
            </span>

          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="cursor-pointer  group flex items-center  space-x-4 bg-red-600 px-3 py-1.5 rounded-md"
            >
              <Shield className="h-7 w-7 scale-100  transition-all duration-400 group-hover:rotate-180 group-hover:scale-110 text-white" />
              <span className="text-white font-medium">Admin</span>
            </Link>
          )}
        </div>
        <Button onClick={handleLogout} className="cursor-pointer bg-black text-white ">
          Logout
        </Button>
      </header>
    </div>
  )
}
