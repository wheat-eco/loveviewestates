"use client"

import type React from "react"

import { forwardRef } from "react"
import styles from "./Textarea.module.css"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className = "", error, ...props }, ref) => {
  return <textarea ref={ref} className={`${styles.textarea} ${error ? styles.error : ""} ${className}`} {...props} />
})

Textarea.displayName = "Textarea"
