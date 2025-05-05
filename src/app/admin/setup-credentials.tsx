"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import styles from "./admin.module.css"

export default function SetupCredentialsPage() {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error("Failed to create user")
      }

      // 2. Add the user to the users table with admin role
      const { error: insertError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        role: "admin",
      })

      if (insertError) {
        throw insertError
      }

      setMessage("Admin user created successfully! You can now log in with these credentials.")

      // Clear form
      setEmail("")
      setPassword("")
      setFullName("")
    } catch (error: any) {
      setError(error.message || "An error occurred while setting up admin credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.setupContainer}>
      <div className={styles.setupCard}>
        <h1>Setup Admin Credentials</h1>
        <p className={styles.setupInfo}>
          Use this form to create your initial admin user. This page should be protected or removed after initial setup.
        </p>

        {message && <div className={styles.successMessage}>{message}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSetupAdmin} className={styles.setupForm}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <small>Password must be at least 8 characters</small>
          </div>

          <button type="submit" className={styles.setupButton} disabled={loading}>
            {loading ? "Creating..." : "Create Admin User"}
          </button>
        </form>
      </div>
    </div>
  )
}
