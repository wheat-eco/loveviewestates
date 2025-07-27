import { Suspense } from "react"
import PropertiesList from "./PropertiesList"
import { Spinner } from "@/components/ui/spinner"
import AdminLayout from "@/components/admin/AdminLayout"
import styles from "./properties.module.css"

export default function PropertiesPage() {
  // A fallback component to show while the main component is loading
  const PageFallback = () => (
    <AdminLayout title="Properties">
      <div className={styles.loadingContainer}>
        <Spinner size="large" />
      </div>
    </AdminLayout>
  )

  return (
    <Suspense fallback={<PageFallback />}>
      <PropertiesList />
    </Suspense>
  )
}