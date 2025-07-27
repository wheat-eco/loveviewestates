
"use client"

import { useParams } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import PropertyForm from "@/components/admin/properties/PropertyForm"
import { Alert } from "@/components/ui/alert"
import styles from "../../add/add-property.module.css"

export default function EditPropertyPage() {
  const params = useParams()
  const propertyId = params.id ? Number.parseInt(params.id as string) : null

  if (!propertyId) {
    return (
      <AdminLayout title="Edit Property">
        <Alert variant="error">Invalid Property ID</Alert>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Property">
      <div className={styles.pageHeader}>
        <h1>Edit Property</h1>
        <p>Update property details and information</p>
      </div>

      <PropertyForm mode="edit" propertyId={propertyId} />
    </AdminLayout>
  )
}

    