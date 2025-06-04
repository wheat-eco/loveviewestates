"use client"

import type React from "react"

import { forwardRef } from "react"
import styles from "./Checkbox.module.css"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className = "", label, ...props }, ref) => {
  return (
    <div className={`${styles.checkboxWrapper} ${className}`}>
      <input ref={ref} type="checkbox" className={styles.checkbox} {...props} />
      {label && (
        <label htmlFor={props.id} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"
