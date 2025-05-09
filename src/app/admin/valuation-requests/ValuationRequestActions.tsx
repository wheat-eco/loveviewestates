"use client"

import { useState } from "react"
import { updateValuationRequestStatus, deleteValuationRequest } from "./actions"
import ValuationRequestModal from "@/components/admin/valuation-requests/ValuationRequestModal"

interface ValuationRequest {
  id: number
  full_name: string
  email: string
  phone: string
  postcode: string
  property_type: string
  bedrooms: number
  valuation_type: string
  message?: string
  status: string
  created_at: string
  move_date?: string
}

interface ValuationRequestActionsProps {
  request: ValuationRequest
  styles: any
}

export default function ValuationRequestActions({ request, styles }: ValuationRequestActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(request.status)

  const handleStatusChange = async (status: string) => {
    try {
      const formData = new FormData()
      formData.append("requestId", request.id.toString())
      formData.append("status", status)

      const result = await updateValuationRequestStatus(formData)

      if (result.success) {
        setCurrentStatus(status)
      } else {
        console.error("Failed to update status:", result.error)
        alert("Failed to update status: " + result.error)
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("An error occurred while updating the status")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this valuation request? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const formData = new FormData()
      formData.append("requestId", request.id.toString())

      const result = await deleteValuationRequest(formData)

      if (result.success) {
        // Redirect to refresh the page
        window.location.href = "/admin/valuation-requests?success=Request deleted successfully"
      } else {
        console.error("Failed to delete request:", result.error)
        alert("Failed to delete request: " + result.error)
        setIsDeleting(false)
      }
    } catch (error) {
      console.error("Error deleting request:", error)
      alert("An error occurred while deleting the request")
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className={styles.actionButtons}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => setIsModalOpen(true)}
          title="View details"
        >
          View
        </button>

        {currentStatus === "pending" && (
          <button
            className={`${styles.btn} ${styles.btnSuccess}`}
            onClick={() => handleStatusChange("completed")}
            title="Mark as completed"
          >
            Complete
          </button>
        )}

        {currentStatus === "pending" && (
          <button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={() => handleStatusChange("cancelled")}
            title="Mark as cancelled"
          >
            Cancel
          </button>
        )}

        <button
          className={`${styles.btn} ${styles.btnDanger}`}
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete request"
        >
          {isDeleting ? "..." : "Delete"}
        </button>
      </div>

      {isModalOpen && (
        <ValuationRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={{
            id: request.id,
            name: request.full_name,
            email: request.email,
            phone: request.phone,
            address: request.postcode, // Using postcode as address since that's what we have
            postcode: request.postcode,
            property_type: request.property_type,
            bedrooms: request.bedrooms,
            request_type: request.valuation_type,
            message: request.message || null,
            status: currentStatus,
            created_at: request.created_at,
            move_date: request.move_date,
          }}
          onStatusChange={(newStatus) => {
            setCurrentStatus(newStatus)
          }}
        />
      )}
    </>
  )
}
