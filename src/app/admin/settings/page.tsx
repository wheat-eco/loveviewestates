
"use client"

import { useState, useEffect } from "react"
import { fetchSettings, sendTestEmail } from "./actions"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Mail, Send } from "lucide-react"
import styles from "./settings.module.css"

type Settings = {
  EMAIL_HOST: string
  EMAIL_PORT: string
  EMAIL_USER: string
  EMAIL_FROM: string
  EMAIL_TO: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      setLoading(true)
      try {
        const fetchedSettings = await fetchSettings()
        setSettings(fetchedSettings)
      } catch (err) {
        setError("Failed to load settings.")
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSendTestEmail = async () => {
    setIsSending(true)
    setError(null)
    setSuccess(null)
    try {
      await sendTestEmail()
      setSuccess(`Test email sent successfully to ${settings?.EMAIL_TO}!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <AdminLayout title="Email Settings">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Email Configuration</h1>
          <p>These settings are read from your server's .env file and are read-only.</p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Mail size={24} />
            <h2>Current SMTP Settings</h2>
          </div>
          <div className={styles.cardContent}>
            {loading ? (
              <div className={styles.loadingState}>
                <Spinner />
                <span>Loading settings...</span>
              </div>
            ) : settings ? (
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <span className={styles.settingLabel}>Host</span>
                  <span className={styles.settingValue}>{settings.EMAIL_HOST || "Not Set"}</span>
                </div>
                <div className={styles.settingItem}>
                  <span className={styles.settingLabel}>Port</span>
                  <span className={styles.settingValue}>{settings.EMAIL_PORT || "Not Set"}</span>
                </div>
                <div className={styles.settingItem}>
                  <span className={styles.settingLabel}>User</span>
                  <span className={styles.settingValue}>{settings.EMAIL_USER || "Not Set"}</span>
                </div>
                <div className={styles.settingItem}>
                  <span className={styles.settingLabel}>Send From Address</span>
                  <span className={styles.settingValue}>{settings.EMAIL_FROM || "Not Set"}</span>
                </div>
                <div className={styles.settingItem}>
                  <span className={styles.settingLabel}>Admin To Address</span>
                  <span className={styles.settingValue}>{settings.EMAIL_TO || "Not Set"}</span>
                </div>
              </div>
            ) : (
              <p>Could not load settings.</p>
            )}
          </div>
          <div className={styles.cardFooter}>
            <p className={styles.footerText}>
              To change these values, you must edit the .env file and restart the server.
            </p>
            <Button onClick={handleSendTestEmail} disabled={isSending || loading}>
              {isSending ? <Spinner size="small" /> : <Send size={16} />}
              {isSending ? "Sending..." : "Send Test Email"}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
