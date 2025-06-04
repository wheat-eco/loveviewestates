"use client"

import type React from "react"

import { forwardRef } from "react"
import styles from "./Input.module.css"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", error, ...props }, ref) => {
  return <input ref={ref} className={`${styles.input} ${error ? styles.error : ""} ${className}`} {...props} />
})

Input.displayName = "Input"
