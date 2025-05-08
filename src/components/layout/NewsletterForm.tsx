"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")
    setIsError(false)

    try {
      const formData = new FormData()
      formData.append("email", email)

      const response = await fetch("/api/subscribe", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setMessage(result.message)
        setEmail("")

        if (result.redirectUrl) {
          router.push(result.redirectUrl)
        }
      } else {
        setIsError(true)
        setMessage(result.message || "Failed to subscribe. Please try again.")
      }
    } catch (error) {
      setIsError(true)
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="newsletter">
      <h4>Subscribe to our newsletter</h4>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>

        {message && (
          <p className={`newsletter-message ${isError ? "newsletter-error" : "newsletter-success"}`}>{message}</p>
        )}
      </form>
    </div>
  )
}
