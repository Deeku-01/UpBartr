"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dailog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Eye, EyeOff, Mail, User, MapPin, Lock } from "lucide-react"
import axios from "axios"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    location: "",
    bio: "",
    skillsOffered: "",
    skillsWanted: "",
    agreeToTerms: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    console.log(`Updated ${field}:`, value)
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
  console.log("=== FORM SUBMISSION START ===")
  console.log("Form Data:", formData)
  console.log("Form Data (JSON):", JSON.stringify(formData, null, 2))
  console.log("=== FORM SUBMISSION END ===")
  
  // Optional: Show alert to confirm submission
  alert("Account created successfully! Welcome to UpBartr!")
    // Here you would typically send formData to your backend API
    axios.post("http://localhost:3000/api/auth/register", formData)
      .then((response) => {
        console.log("Signup successful:", response.data)
        // Handle successful signup (e.g., show success message, redirect, etc.)
      })
      .catch((error) => {
        console.error("Signup error:", error)
      })
  
    // Close modal after successful signup
    onClose()
}

  const isStep1Valid = formData.firstName && formData.lastName && formData.email && formData.username
  const isStep2Valid = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
  const isStep3Valid = formData.agreeToTerms

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Join UpBartr</DialogTitle>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-8 h-2 rounded-full ${i <= step ? "bg-blue-600" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Let's get to know you</h3>
                <p className="text-sm text-gray-600">Tell us about yourself</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="pl-10"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="pl-10"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    placeholder="johndoe"
                    className="pl-10"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500">This will be your unique identifier on UpBartr</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="New York, NY"
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleNext} className="w-full" disabled={!isStep1Valid}>
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Password & Security */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Secure your account</h3>
                <p className="text-sm text-gray-600">Create a strong password</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords don't match</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself and your expertise..."
                  className="min-h-[80px]"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1" disabled={!isStep2Valid}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Skills & Preferences */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">What skills do you have?</h3>
                <p className="text-sm text-gray-600">Help others find you</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillsOffered">Skills You Can Offer (Optional)</Label>
                <Textarea
                  id="skillsOffered"
                  placeholder="e.g., Web Development, Graphic Design, Photography..."
                  className="min-h-[60px]"
                  value={formData.skillsOffered}
                  onChange={(e) => handleInputChange("skillsOffered", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillsWanted">Skills You're Looking For (Optional)</Label>
                <Textarea
                  id="skillsWanted"
                  placeholder="e.g., Logo Design, Content Writing, Marketing..."
                  className="min-h-[60px]"
                  value={formData.skillsWanted}
                  onChange={(e) => handleInputChange("skillsWanted", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={!isStep3Valid}
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}

          {/* Sign In Link */}
          <div className="text-center mt-6 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button onClick={onClose} className="text-blue-600 hover:underline font-medium">
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
