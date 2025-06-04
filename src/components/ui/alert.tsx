"use client"

import type React from "react"

import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"
import styles from "./Alert.module.css"

interface AlertProps {
  variant: "success" | "error" | "warning" | "info"
  children: React.ReactNode
  className?: string
}

export function Alert({ variant, children, className = "" }: AlertProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const Icon = icons[variant]

  return (
    <div className={`${styles.alert} ${styles[variant]} ${className}`}>
      <Icon size={20} className={styles.icon} />
      <div className={styles.content}>{children}</div>
    </div>
  )
}
