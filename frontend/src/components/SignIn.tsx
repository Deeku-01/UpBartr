"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dailog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"
import axios from "axios"
import { setAuthToken } from "./utils/setAuthToken"
import { useNavigate } from "react-router-dom"

interface SigninModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignup?: () => void
}

export default function SigninModal({ isOpen, onClose, onSwitchToSignup }: SigninModalProps) {
    const navigate=useNavigate();

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      const data = await axios.post('http://localhost:3000/api/auth/login',formData).then((response) => {return response.data}).catch((error) => {
        console.error("Login error:", error)
        throw new Error("Login failed. Please check your credentials.")
      })
      // Simulate login logic here
      console.log("Sign in attempt:" , formData)

      if(data){
        // Handle successful login
        console.log("Login successful:", data)
        
        setAuthToken(data.token,data.user.id)

        // redirect to home page or dashboard
        navigate("/dashboard")


      }else{
        throw new Error("Login failed. Please check your credentials.")
      }

      
      // For demo purposes, simulate success
      onClose()
    } catch (err) {
      setError("Invalid email/username or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log("Forgot password clicked")
    // You could open another modal or redirect to forgot password page
  }

  const handleSwitchToSignup = () => {
    onClose()
    if (onSwitchToSignup) {
      onSwitchToSignup()
    }
  }

  const isFormValid = formData.emailOrUsername && formData.password

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
          <p className="text-center text-gray-600 mt-2">Sign in to your UpBartr account</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email or Username */}
          <div className="space-y-2">
            <Label htmlFor="emailOrUsername">Email or Username</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="emailOrUsername"
                type="text"
                placeholder="Enter your email or username"
                className="pl-10"
                value={formData.emailOrUsername}
                onChange={(e) => handleInputChange("emailOrUsername", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                Remember me
              </Label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Sign In Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={() => console.log("Google sign in")}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={() => console.log("GitHub sign in")}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={handleSwitchToSignup}
              className="text-blue-600 hover:underline font-medium"
              disabled={isLoading}
            >
              Sign up for free
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
