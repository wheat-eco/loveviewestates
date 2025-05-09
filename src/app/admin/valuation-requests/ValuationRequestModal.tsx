"use server"

import { useState } from "react"
import { X, Mail, Phone, MapPin, Home, Calendar, MessageSquare } from "lucide-react"
import styles from "@/app/admin/valuation-requests/valuation-requests.module.css"

interface ValuationRequest {
  id: number
  name: string
  email: string
  phone: string
  address: string
  postcode: string
  property_type: string
  bedrooms: number
  request_type: string
  message: string | null
  status: string
  created_at: string
  move_date?: string
}

interface ValuationRequestModalProps {
  isOpen: boolean
  onClose: () => void
  request: ValuationRequest
  onStatusChange: (newStatus: string) => void
}

export default function ValuationRequestModal({
  isOpen,
  onClose,
  request,
  onStatusChange,
}: ValuationRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sendEmail, setSendEmail] = useState(true)

  if (!isOpen) return null

  const formatDate = (dateString: string) => {
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

      const response = await fetch("/api/admin/valuation-requests/update-status", {
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
          <h2>Valuation Request Details</h2>
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
                    : request.status === "completed"
                      ? styles.statusBadgeCompleted
                      : styles.statusBadgeCancelled
                }`}
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>

            <div className={styles.requestDate}>
              <Calendar size={16} />
              <span>Submitted on {formatDate(request.created_at)}</span>
            </div>

            {request.move_date && (
              <div className={styles.requestDate}>
                <Calendar size={16} />
                <span>Moving date: {formatDate(request.move_date)}</span>
              </div>
            )}

            <div className={styles.requestType}>
              <span className={request.request_type === "sales" ? styles.salesBadge : styles.rentalBadge}>
                {request.request_type === "sales" ? "Sales" : "Rental"} Valuation
              </span>
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
              <h4>Property Information</h4>
              <div className={styles.detailItem}>
                <MapPin size={16} />
                <span>
                  {request.address}, {request.postcode}
                </span>
              </div>
              <div className={styles.detailItem}>
                <Home size={16} />
                <span>
                  {request.property_type}, {request.bedrooms} bedroom
                  {request.bedrooms !== 1 ? "s" : ""}
                </span>
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
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Mark as Cancelled"}
                </button>
                <button
                  className={styles.btnSuccess}
                  onClick={() => handleStatusChange("completed")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Mark as Completed"}
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
