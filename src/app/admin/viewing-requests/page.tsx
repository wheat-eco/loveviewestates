import { Suspense } from "react"
import Link from "next/link"
import styles from "./viewing-requests.module.css"
import ViewingRequestsTable from "./ViewingRequestsTable"

export default function ViewingRequestsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get status filter from query params (safely)
  const statusParam = searchParams.status
  const statusFilter = typeof statusParam === "string" ? statusParam : "all"

  // Get success/error messages from query params (safely)
  const successParam = searchParams.success
  const success = typeof successParam === "string" ? successParam : undefined

  const errorParam = searchParams.error
  const error = typeof errorParam === "string" ? errorParam : undefined

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Viewing Requests</h1>
      </header>

      {success && <div className={styles.alertSuccess}>{success}</div>}
      {error && <div className={styles.alertDanger}>{error}</div>}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Manage Viewing Requests</h2>
        </div>

        <div className={styles.filterTabs}>
          <Link
            href="/admin/viewing-requests"
            className={`${styles.filterTab} ${statusFilter === "all" ? styles.active : ""}`}
          >
            All Requests
          </Link>
          <Link
            href="/admin/viewing-requests?status=pending"
            className={`${styles.filterTab} ${statusFilter === "pending" ? styles.active : ""}`}
          >
            Pending
          </Link>
          <Link
            href="/admin/viewing-requests?status=approved"
            className={`${styles.filterTab} ${statusFilter === "approved" ? styles.active : ""}`}
          >
            Approved
          </Link>
          <Link
            href="/admin/viewing-requests?status=rejected"
            className={`${styles.filterTab} ${statusFilter === "rejected" ? styles.active : ""}`}
          >
            Rejected
          </Link>
        </div>

        <Suspense fallback={<div className={styles.loading}>Loading requests...</div>}>
          <ViewingRequestsTable statusFilter={statusFilter} />
        </Suspense>
      </div>
    </div>
  )
}
