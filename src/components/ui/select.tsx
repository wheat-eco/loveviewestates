"use client"

import type React from "react"

import { forwardRef } from "react"
import styles from "./Select.module.css"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", error, children, ...props }, ref) => {
    return (
      <select ref={ref} className={`${styles.select} ${error ? styles.error : ""} ${className}`} {...props}>
        {children}
      </select>
    )
  },
)

Select.displayName = "Select"
