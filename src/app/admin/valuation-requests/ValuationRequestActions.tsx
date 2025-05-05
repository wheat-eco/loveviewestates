"use client"

import { useState } from "react"
import { Eye, Check, X, Trash2 } from "lucide-react"

// Server actions
import { updateRequestStatus, deleteRequest } from "./actions"

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
}

export default function ValuationRequestActions({
  request,
  styles,
}: {
  request: ValuationRequest
  styles: any
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateStatus = async (status: string) => {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("request_id", request.id.toString())
    formData.append("status", status)

    try {
      const result = await updateRequestStatus(formData)
      if (!result.success) {
        alert(result.message)
      }
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this request?")) {
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append("request_id", request.id.toString())

    try {
      const result = await deleteRequest(formData)
      if (!result.success) {
        alert(result.message)
      }
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error("Error deleting request:", error)
      alert("Failed to delete request")
    } finally {
      setIsLoading(false)
    }
  }

  const showDetails = () => {
    alert(`
Name: ${request.name}
Email: ${request.email}
Phone: ${request.phone}
Address: ${request.address}, ${request.postcode}
Property: ${request.property_type}, ${request.bedrooms} bedroom${request.bedrooms !== 1 ? "s" : ""}
Type: ${request.request_type === "sales" ? "Sales" : "Rental"} Valuation
Message: ${request.message || "No message provided"}
Status: ${request.status}
Date: ${new Date(request.created_at).toLocaleString()}
    `)
  }

  return (
    <div className={styles.actionButtons}>
      <button
        className={`${styles.btn} ${styles.btnInfo}`}
        onClick={showDetails}
        title="View details"
        disabled={isLoading}
      >
        <Eye size={16} />
      </button>

      {request.status === "pending" && (
        <>
          <button
            className={`${styles.btn} ${styles.btnSuccess}`}
            onClick={() => handleUpdateStatus("completed")}
            title="Mark as completed"
            disabled={isLoading}
          >
            <Check size={16} />
          </button>

          <button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={() => handleUpdateStatus("cancelled")}
            title="Cancel request"
            disabled={isLoading}
          >
            <X size={16} />
          </button>
        </>
      )}

      <button
        className={`${styles.btn} ${styles.btnDanger}`}
        onClick={handleDelete}
        title="Delete request"
        disabled={isLoading}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
