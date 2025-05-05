"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Eye, Check, X, Trash2 } from "lucide-react"
import styles from "./viewing-requests.module.css"
import { updateRequestStatus, deleteRequest } from "./actions"

// Define viewing request type
interface ViewingRequest {
  id: number
  property_id: number
  name: string
  email: string
  phone: string
  preferred_date: string | null
  message: string | null
  status: string
  created_at: string
  properties: {
    id: number
    title: string
    slug: string
  }
}

export default function ViewingRequestsTable({ statusFilter }: { statusFilter: string }) {
  const [requests, setRequests] = useState<ViewingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/viewing-requests?status=${statusFilter}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setRequests(data.requests)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching viewing requests:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [statusFilter])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return styles.statusBadgePending
      case "approved":
        return styles.statusBadgeApproved
      case "rejected":
        return styles.statusBadgeRejected
      default:
        return styles.statusBadgePending
    }
  }

  const handleUpdateStatus = async (requestId: number, status: string) => {
    try {
      const formData = new FormData()
      formData.append("request_id", requestId.toString())
      formData.append("status", status)

      const result = await updateRequestStatus(formData)

      if (result.success) {
        // Update the request status in the local state
        setRequests(requests.map((req) => (req.id === requestId ? { ...req, status } : req)))
      } else {
        alert(result.message)
      }
    } catch (err) {
      console.error("Error updating request status:", err)
      alert("Failed to update request status")
    }
  }

  const handleDelete = async (requestId: number) => {
    if (!confirm("Are you sure you want to delete this request?")) {
      return
    }

    try {
      const formData = new FormData()
      formData.append("request_id", requestId.toString())

      const result = await deleteRequest(formData)

      if (result.success) {
        // Remove the request from the local state
        setRequests(requests.filter((req) => req.id !== requestId))
      } else {
        alert(result.message)
      }
    } catch (err) {
      console.error("Error deleting request:", err)
      alert("Failed to delete request")
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading viewing requests...</div>
  }

  if (error) {
    return <div className={styles.alertDanger}>Error loading requests: {error}</div>
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Property</th>
            <th>Preferred Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests && requests.length > 0 ? (
            requests.map((request: ViewingRequest) => (
              <tr key={request.id}>
                <td>{formatDate(request.created_at)}</td>
                <td>{request.name}</td>
                <td>
                  <div>{request.email}</div>
                  <div>{request.phone}</div>
                </td>
                <td>
                  <Link href={`/property/${request.properties.slug}`} target="_blank" className={styles.propertyLink}>
                    {request.properties.title}
                  </Link>
                </td>
                <td>
                  {request.preferred_date
                    ? new Date(request.preferred_date).toLocaleDateString("en-GB")
                    : "Not specified"}
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.btn} ${styles.btnInfo}`}
                      onClick={() => {
                        // Show request details in a modal or alert for now
                        alert(`Message: ${request.message || "No message provided"}`)
                      }}
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>

                    {request.status === "pending" && (
                      <>
                        <button
                          className={`${styles.btn} ${styles.btnSuccess}`}
                          title="Approve request"
                          onClick={() => handleUpdateStatus(request.id, "approved")}
                        >
                          <Check size={16} />
                        </button>

                        <button
                          className={`${styles.btn} ${styles.btnWarning}`}
                          title="Reject request"
                          onClick={() => handleUpdateStatus(request.id, "rejected")}
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}

                    <button
                      className={`${styles.btn} ${styles.btnDanger}`}
                      title="Delete request"
                      onClick={() => handleDelete(request.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.noResults}>
                No viewing requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
