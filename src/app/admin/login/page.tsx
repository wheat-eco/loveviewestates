"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, UserPlus } from "lucide-react"
import styles from "./login.module.css"

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [noAdminFound, setNoAdminFound] = useState(false)

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        // Verify admin role
        const { data: userData, error: userError } = await supabase
          .from("admin")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (userData?.role === "admin") {
          router.push("/admin")
        }
      }
    }
    checkAuth()

    // Check if any admin exists
    const checkAdminExists = async () => {
      try {
        const { data, error, count } = await supabase
          .from("admin")
          .select("id", { count: "exact" })
          .eq("role", "admin")
          .limit(1)

        if (error) {
          console.error("Error checking admin existence:", error)
          // If there's an error, it might be because the table doesn't exist
          setNoAdminFound(true)
          return
        }

        setNoAdminFound(count === 0)
      } catch (error) {
        console.error("Error in admin check:", error)
        setNoAdminFound(true)
      }
    }

    checkAdminExists()
  }, [supabase, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields")
        setLoading(false)
        return
      }

      if (!formData.email.includes("@")) {
        setError("Please enter a valid email address")
        setLoading(false)
        return
      }

      // Attempt login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.")
        } else {
          setError(authError.message)
        }
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError("Login failed. Please try again.")
        setLoading(false)
        return
      }

      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from("admin")
        .select("role, full_name, is_active")
        .eq("id", authData.user.id)
        .single()

      if (userError) {
        console.error("Error fetching user data:", userError)

        // Special handling for missing user record
        if (userError.code === "PGRST116") {
          // Create user record with admin role if this is the first login
          const { count } = await supabase.from("admin").select("id", { count: "exact" })

          if (count === 0) {
            // This is the first user, make them an admin
            await supabase.from("admin").insert({
              id: authData.user.id,
              email: authData.user.email,
              full_name: authData.user.user_metadata.full_name || authData.user.email?.split("@")[0],
              role: "admin",
              is_active: true,
            })

            // Save remember me preference
            if (rememberMe) {
              localStorage.setItem("admin_remember", "true")
            } else {
              localStorage.removeItem("admin_remember")
            }

            // Redirect to admin dashboard
            router.push("/admin")
            return
          } else {
            setError("Your user account is not linked to an admin profile. Please contact support.")
            await supabase.auth.signOut()
            setLoading(false)
            return
          }
        } else {
          setError("Unable to verify user permissions. Please try again later.")
          await supabase.auth.signOut()
          setLoading(false)
          return
        }
      }

      if (!userData) {
        setError("User profile not found. Please contact support.")
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      if (userData.role !== "admin") {
        setError("Access denied. You don't have admin privileges.")
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      if (!userData.is_active) {
        setError("Your account has been deactivated. Please contact support.")
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem("admin_remember", "true")
      } else {
        localStorage.removeItem("admin_remember")
      }

      // Successful login - redirect to admin dashboard
      router.push("/admin")
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logoContainer}>
            <Shield className={styles.logoIcon} size={32} />
            <h1>Love View Estate</h1>
          </div>
          <h2>Admin Portal</h2>
          <p>Sign in to access the admin dashboard</p>
        </div>

        {noAdminFound && (
          <div className={styles.noAdminAlert}>
            <h3>No Admin Account Found</h3>
            <p>
              It looks like this is your first time setting up the system. You need to create an admin account first.
            </p>
            <Link href="/admin/create-first-admin" className={styles.createAdminButton}>
              <UserPlus size={16} />
              <span>Create Admin Account</span>
            </Link>
          </div>
        )}

        {error && (
          <div className={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
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
                autoComplete="email"
                className={error ? styles.inputError : ""}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className={error ? styles.inputError : ""}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.formOptions}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span className={styles.checkboxCustom}></span>
              Remember me
            </label>
          </div>

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? (
              <div className={styles.loadingSpinner}></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>
            Need help? Contact <a href="mailto:support@loveviewestate.com">support@loveviewestate.com</a>
          </p>
        </div>
      </div>

      <div className={styles.backgroundPattern}></div>
    </div>
  )
}
