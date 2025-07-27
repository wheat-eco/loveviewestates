
"use client"

import { useFormState, useFormStatus } from "react-dom"
import { login } from "./actions"
import styles from "./login.module.css"
import { KeyRound, Mail, LogIn, AlertCircle } from "lucide-react"

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" className={styles.submitButton} disabled={pending}>
      {pending ? (
        <div className={styles.spinner}></div>
      ) : (
        <>
          <LogIn size={18} />
          <span>Sign In</span>
        </>
      )}
    </button>
  )
}

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
            <div className={styles.iconContainer}>
                <KeyRound className={styles.icon} size={32}/>
            </div>
            <h1>Admin Panel Login</h1>
            <p>Please sign in to continue</p>
        </div>

        <form action={login} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20}/>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
                <KeyRound className={styles.inputIcon} size={20}/>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                />
            </div>
          </div>
          
          <LoginButton />

          {searchParams?.message && (
            <div className={styles.error}>
                <AlertCircle className={styles.errorIcon} size={20}/>
                <p className={styles.errorText}>{searchParams.message}</p>
            </div>
          )}
        </form>

      </div>
    </div>
  )
}
