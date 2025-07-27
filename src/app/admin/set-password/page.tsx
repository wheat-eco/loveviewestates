
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Lock, ArrowRight, AlertCircle } from "lucide-react"
import styles from "../login/login.module.css" // Reusing styles

export default function SetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [sessionChecked, setSessionChecked] = useState(false)

  // This effect is crucial for handling the session from the invitation link
  useEffect(() => {
    const checkSession = async () => {
      // Supabase automatically handles the session when the user clicks the invite link.
      // We just need to check if a session exists.
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setError("Invalid or expired invitation link. Please request a new one.")
      }
      setSessionChecked(true)
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      setLoading(false)
      return
    }

    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        throw updateError
      }

      setSuccess("Password set successfully! Redirecting to the admin dashboard...")

      setTimeout(() => {
        router.push("/admin")
      }, 3000)

    } catch (error: any) {
      console.error("Password set error:", error)
      setError(error.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (!sessionChecked) {
      return (
          <div className={styles.container}>
              <div className={styles.spinner}></div>
          </div>
      )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Set Your Password</h1>
          <p>Welcome! Choose a secure password to complete your account setup.</p>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle className={styles.errorIcon} size={20} />
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {success && (
          <div className={`${styles.error} bg-green-100 border-green-200`}>
             <p className="text-green-800">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password">New Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a secure password"
                required
                disabled={loading || !!success || !!error}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading || !!success || !!error}>
            {loading ? (
              <div className={styles.spinner}></div>
            ) : (
              <>
                <span>Set Password & Login</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
