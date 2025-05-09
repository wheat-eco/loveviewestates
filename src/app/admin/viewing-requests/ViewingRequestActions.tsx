"use client"

import { SetStateAction, useState } from "react"
import { updateRequestStatus, deleteRequest } from "./actions"
import ViewingRequestModal from "@/components/admin/viewing-requests/ViewingRequestModal"

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
  preferred_date: string | null
  preferred_time: string | null
  status: string
  created_at: string
  property: Property
}

interface ViewingRequestActionsProps {
  request: ViewingRequest
  styles: any
}

export default function ViewingRequestActions({ request, styles }: ViewingRequestActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(request.status)

  const handleStatusChange = async (status: string) => {
    try {
      const formData = new FormData()
      formData.append("requestId", request.id.toString())
      formData.append("status", status)

      const result = await updateRequestStatus(formData)

      if (result.success) {
        setCurrentStatus(status)
      } else {
        console.error("Failed to update status:", result.message)
        alert("Failed to update status: " + result.message)
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("An error occurred while updating the status")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this viewing request? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const formData = new FormData()
      formData.append("requestId", request.id.toString())

      const result = await deleteRequest(formData)

      if (result.success) {
        // Redirect to refresh the page
        window.location.href = "/admin/viewing-requests?success=Request deleted successfully"
      } else {
        console.error("Failed to delete request:", result.message)
        alert("Failed to delete request: " + result.message)
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
            onClick={() => handleStatusChange("approved")}
            title="Approve request"
          >
            Approve
          </button>
        )}

        {currentStatus === "pending" && (
          <button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={() => handleStatusChange("rejected")}
            title="Reject request"
          >
            Reject
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
        <ViewingRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={{
            id: request.id,
            name: request.name,
            email: request.email,
            phone: request.phone,
            message: request.message,
            preferredDate: request.preferred_date,
            preferredTime: request.preferred_time,
            status: currentStatus,
            createdAt: request.created_at,
            property: {
              id: request.property.id,
              title: request.property.title,
              slug: request.property.slug,
            },
          }}
          onStatusChange={(newStatus: SetStateAction<string>) => {
            setCurrentStatus(newStatus)
          }}
        />
      )}
    </>
  )
}
