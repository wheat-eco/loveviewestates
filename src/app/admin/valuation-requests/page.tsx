import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import styles from "./valuation-requests.module.css"
import ValuationRequestActions from "./ValuationRequestActions"

// Define valuation request type
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

export default async function ValuationRequestsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get status filter from query params - convert to string safely
  const statusFilter = typeof searchParams.status === "string" ? searchParams.status : "all"
  const typeFilter = typeof searchParams.type === "string" ? searchParams.type : "all"

  // Get success/error messages from query params
  const success = typeof searchParams.success === "string" ? searchParams.success : undefined
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined

  // Create a read-only Supabase client for server components
  const supabase = await createClient()

  // Build query based on filters
  let query = supabase.from("valuation_requests").select("*")

  // Filter by status if not "all"
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter)
  }

  // Filter by request type if not "all"
  if (typeFilter !== "all") {
    query = query.eq("request_type", typeFilter)
  }

  // Order by created_at desc
  query = query.order("created_at", { ascending: false })

  // Execute query
  const { data: requests, error: fetchError } = await query

  if (fetchError) {
    console.error("Error fetching valuation requests:", fetchError)
  }

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
      case "completed":
        return styles.statusBadgeCompleted
      case "cancelled":
        return styles.statusBadgeCancelled
      default:
        return styles.statusBadgePending
    }
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Valuation Requests</h1>
      </header>

      {success && <div className={styles.alertSuccess}>{success}</div>}
      {error && <div className={styles.alertDanger}>{error}</div>}
      {fetchError && <div className={styles.alertDanger}>Error loading requests: {fetchError.message}</div>}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Manage Valuation Requests</h2>
        </div>

        <div className={styles.filterTabs}>
          <Link
            href="/admin/valuation-requests"
            className={`${styles.filterTab} ${statusFilter === "all" && typeFilter === "all" ? styles.active : ""}`}
          >
            All Requests
          </Link>
          <Link
            href="/admin/valuation-requests?status=pending"
            className={`${styles.filterTab} ${statusFilter === "pending" ? styles.active : ""}`}
          >
            Pending
          </Link>
          <Link
            href="/admin/valuation-requests?status=completed"
            className={`${styles.filterTab} ${statusFilter === "completed" ? styles.active : ""}`}
          >
            Completed
          </Link>
          <Link
            href="/admin/valuation-requests?type=sales"
            className={`${styles.filterTab} ${typeFilter === "sales" ? styles.active : ""}`}
          >
            Sales Valuations
          </Link>
          <Link
            href="/admin/valuation-requests?type=rental"
            className={`${styles.filterTab} ${typeFilter === "rental" ? styles.active : ""}`}
          >
            Rental Valuations
          </Link>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Property</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests && requests.length > 0 ? (
                requests.map((request: ValuationRequest) => (
                  <tr key={request.id}>
                    <td>{formatDate(request.created_at)}</td>
                    <td>{request.name}</td>
                    <td>
                      <div>{request.email}</div>
                      <div>{request.phone}</div>
                    </td>
                    <td>
                      <div>{request.address}</div>
                      <div>{request.postcode}</div>
                    </td>
                    <td>
                      {request.property_type}, {request.bedrooms} bedroom{request.bedrooms !== 1 ? "s" : ""}
                    </td>
                    <td>
                      <span className={request.request_type === "sales" ? styles.salesBadge : styles.rentalBadge}>
                        {request.request_type === "sales" ? "Sales" : "Rental"}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <ValuationRequestActions request={request} styles={styles} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className={styles.noResults}>
                    No valuation requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
