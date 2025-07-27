
"use client"

import AdminLayout from "@/components/admin/AdminLayout"
import PropertyForm from "@/components/admin/properties/PropertyForm"
import styles from "./add-property.module.css"

export default function AddPropertyPage() {
  return (
    <AdminLayout title="Add New Property">
      <div className={styles.pageHeader}>
        <h1>Add New Property</h1>
        <p>Create a new property listing with all details</p>
      </div>
      <PropertyForm mode="create" />
    </AdminLayout>
  )
}
