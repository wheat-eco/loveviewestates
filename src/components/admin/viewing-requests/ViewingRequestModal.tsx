"use client"

import { useState } from "react"
import { X, Mail, Phone, Calendar, Clock, MessageSquare, Home } from "lucide-react"
import styles from "@/app/admin/viewing-requests/viewing-requests.module.css"

interface Property {
  id: number
  title: string
  slug: string
}

interface ViewingRequest {
  id: number
  name: string
  email: string
  phone: string
  message: string | null
  preferredDate: string | null
  preferredTime: string | null
  status: string
  createdAt: string
  property: Property
}

interface ViewingRequestModalProps {
  isOpen: boolean
  onClose: () => void
  request: ViewingRequest
  onStatusChange: (newStatus: string) => void
}

export default function ViewingRequestModal({ isOpen, onClose, request, onStatusChange }: ViewingRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sendEmail, setSendEmail] = useState(true)

  if (!isOpen) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not specified"
    return timeString
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("requestId", request.id.toString())
      formData.append("status", newStatus)
      formData.append("sendEmail", sendEmail.toString())
      formData.append("propertyTitle", request.property.title)
      formData.append("propertySlug", request.property.slug)

      const response = await fetch("/api/admin/viewing-requests/update-status", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onStatusChange(newStatus)
        onClose()
      } else {
        alert(result.error || "Failed to update request status")
      }
    } catch (error) {
      console.error("Error updating request status:", error)
      alert("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Viewing Request Details</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.requestInfo}>
            <div className={styles.requestHeader}>
              <h3>{request.name}</h3>
              <span
                className={`${styles.statusBadge} ${
                  request.status === "pending"
                    ? styles.statusBadgePending
                    : request.status === "approved"
                      ? styles.statusBadgeApproved
                      : styles.statusBadgeRejected
                }`}
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>

            <div className={styles.requestDate}>
              <Calendar size={16} />
              <span>Submitted on {formatDateTime(request.createdAt)}</span>
            </div>

            <div className={styles.detailsSection}>
              <h4>Property</h4>
              <div className={styles.detailItem}>
                <Home size={16} />
                <span>{request.property.title}</span>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h4>Contact Information</h4>
              <div className={styles.detailItem}>
                <Mail size={16} />
                <span>{request.email}</span>
              </div>
              <div className={styles.detailItem}>
                <Phone size={16} />
                <span>{request.phone}</span>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h4>Preferred Viewing Time</h4>
              <div className={styles.detailItem}>
                <Calendar size={16} />
                <span>Date: {formatDate(request.preferredDate)}</span>
              </div>
              <div className={styles.detailItem}>
                <Clock size={16} />
                <span>Time: {formatTime(request.preferredTime)}</span>
              </div>
            </div>

            {request.message && (
              <div className={styles.detailsSection}>
                <h4>Additional Message</h4>
                <div className={styles.messageBox}>
                  <MessageSquare size={16} />
                  <p>{request.message}</p>
                </div>
              </div>
            )}
          </div>

          {request.status === "pending" && (
            <div className={styles.actionSection}>
              <div className={styles.emailOption}>
                <label>
                  <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                  Send notification email to client
                </label>
              </div>

              <div className={styles.actionButtons}>
                <button className={styles.btnSecondary} onClick={onClose} disabled={isSubmitting}>
                  Close
                </button>
                <button
                  className={styles.btnWarning}
                  onClick={() => handleStatusChange("rejected")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Reject Request"}
                </button>
                <button
                  className={styles.btnSuccess}
                  onClick={() => handleStatusChange("approved")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Approve Request"}
                </button>
              </div>
            </div>
          )}

          {request.status !== "pending" && (
            <div className={styles.actionButtons}>
              <button className={styles.btnSecondary} onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
