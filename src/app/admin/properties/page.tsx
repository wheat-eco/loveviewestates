import Link from "next/link"
import { Suspense } from "react"
import styles from "./admin-properties.module.css"
import { Plus } from "lucide-react"
import PropertiesTable from "./PropertiesTable"

export default function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get property type from query params (safely)
  const typeParam = searchParams.type
  const propertyType = typeof typeParam === "string" ? typeParam : "all"

  // Get success/error messages from query params (safely)
  const successParam = searchParams.success
  const success = typeof successParam === "string" ? successParam : undefined

  const errorParam = searchParams.error
  const error = typeof errorParam === "string" ? errorParam : undefined

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Manage Properties</h1>
      </header>

      {success && <div className={styles.alertSuccess}>{success}</div>}
      {error && <div className={styles.alertDanger}>{error}</div>}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Properties</h2>
          <Link href="/admin/properties/add" className={styles.addPropertyBtn}>
            <Plus size={16} />
            Add Property
          </Link>
        </div>

        <div className={styles.filterTabs}>
          <Link
            href="/admin/properties"
            className={`${styles.filterTab} ${propertyType === "all" ? styles.active : ""}`}
          >
            All Properties
          </Link>
          <Link
            href="/admin/properties?type=rent"
            className={`${styles.filterTab} ${propertyType === "rent" ? styles.active : ""}`}
          >
            For Rent
          </Link>
          <Link
            href="/admin/properties?type=sale"
            className={`${styles.filterTab} ${propertyType === "sale" ? styles.active : ""}`}
          >
            For Sale
          </Link>
        </div>

        <Suspense fallback={<div className={styles.loading}>Loading properties...</div>}>
          <PropertiesTable propertyType={propertyType} />
        </Suspense>
      </div>
    </div>
  )
}
