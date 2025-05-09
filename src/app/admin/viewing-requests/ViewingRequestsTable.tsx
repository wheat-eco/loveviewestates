import { createClient } from "@/utils/supabase/server"
import ViewingRequestActions from "./ViewingRequestActions"
import styles from "./viewing-requests.module.css"

interface ViewingRequestsTableProps {
  statusFilter: string
}

export default async function ViewingRequestsTable({ statusFilter }: ViewingRequestsTableProps) {
  const supabase = await createClient()

  // Build query based on filters
  let query = supabase.from("viewing_requests").select(`
      *,
      property:property_id (
        id,
        title,
        slug
      )
    `)

  // Filter by status if not "all"
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter)
  }

  // Order by created_at desc
  query = query.order("created_at", { ascending: false })

  // Execute query
  const { data: requests, error } = await query

  if (error) {
    console.error("Error fetching viewing requests:", error)
    return <div className={styles.error}>Error loading viewing requests: {error.message}</div>
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Format time for display
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not specified"
    return timeString
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
            requests.map((request: any) => (
              <tr key={request.id}>
                <td>{formatDate(request.created_at)}</td>
                <td>{request.name}</td>
                <td>
                  <div>{request.email}</div>
                  <div>{request.phone}</div>
                </td>
                <td>
                  {request.property ? (
                    <a href={`/property/${request.property.slug}`} target="_blank" rel="noopener noreferrer">
                      {request.property.title}
                    </a>
                  ) : (
                    "Unknown property"
                  )}
                </td>
                <td>
                  {request.preferred_date ? (
                    <>
                      <div>{formatDate(request.preferred_date)}</div>
                      <div>{formatTime(request.preferred_time)}</div>
                    </>
                  ) : (
                    "Not specified"
                  )}
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </td>
                <td>
                  <ViewingRequestActions request={request} styles={styles} />
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
