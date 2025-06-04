"use client"

import type React from "react"

import styles from "./FormGroup.module.css"

interface FormGroupProps {
  children: React.ReactNode
  className?: string
}

export function FormGroup({ children, className = "" }: FormGroupProps) {
  return <div className={`${styles.formGroup} ${className}`}>{children}</div>
}
