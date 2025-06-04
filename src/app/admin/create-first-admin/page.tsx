"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Shield, User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react"
import styles from "./create-admin.module.css"

export default function CreateFirstAdminPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setDebugInfo(null)

    try {
      // Validate inputs
      if (!formData.email || !formData.password || !formData.fullName) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }

      if (!formData.email.includes("@")) {
        setError("Please enter a valid email address")
        setLoading(false)
        return
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long")
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }

      // First, sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }

      if (!authData.user) {
        throw new Error("Failed to create user")
      }

      // Then, make an API call to set the user as admin
      const response = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authData.user.id,
          email: formData.email,
          fullName: formData.fullName,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // For debugging
        setDebugInfo(responseData)
        throw new Error(responseData.message || "Failed to set admin role")
      }

      // Success!
      setSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/admin/login")
      }, 3000)
    } catch (error: any) {
      console.error("Admin creation error:", error)
      setError(error.message || "Failed to create admin user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Shield className={styles.icon} size={40} />
          <h1>Create First Admin</h1>
          <p>Set up the first administrator account for your system</p>
        </div>

        {success ? (
          <div className={styles.success}>
            <CheckCircle size={50} className={styles.successIcon} />
            <h2>Admin Created Successfully!</h2>
            <p>Your administrator account has been created. You will be redirected to the login page shortly.</p>
            <button onClick={() => router.push("/admin/login")} className={styles.loginButton}>
              Go to Login
            </button>
          </div>
        ) : (
          <>
            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} size={18} />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={18} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a secure password"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={18} />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? (
                  <div className={styles.spinner}></div>
                ) : (
                  <>
                    <span>Create Admin Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" && debugInfo && (
              <div className={styles.debugInfo}>
                <h4>Debug Information:</h4>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
