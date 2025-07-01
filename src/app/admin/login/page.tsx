"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Shield, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import styles from "./login.module.css"

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Sign in with Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        throw new Error(signInError.message)
      }

      if (!authData.user) {
        throw new Error("Login failed")
      }

      // Check if user is admin
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single()

      if (userError) {
        throw new Error("Failed to verify admin status")
      }

      if (userData.role !== "admin" && userData.role !== "superadmin") {
        throw new Error("Access denied. Admin privileges required.")
      }

      // Redirect to admin dashboard
      router.push("/admin/")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Shield className={styles.icon} size={32} />
          </div>
          <h1>Admin Login</h1>
          <p>Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle className={styles.errorIcon} size={20} />
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
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
              <Lock className={styles.inputIcon} size={20} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? (
              <div className={styles.spinner}></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Need to create the first admin?{" "}
            <button onClick={() => router.push("/admin/create-admin")} className={styles.footerLink}>
              Create Admin Account
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
