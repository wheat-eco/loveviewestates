"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import PropertyForm from "@/components/admin/properties/PropertyForm"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import styles from "../../add/add-property.module.css"

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [propertyExists, setPropertyExists] = useState(false)

  const propertyId = params.id ? Number.parseInt(params.id as string) : null

  // Check authentication and property existence
  useEffect(() => {
    const checkAuthAndProperty = async () => {
      setLoading(true)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/admin/login")
          return
        }

        // Check if user has admin role
        const { data: userData, error: userError } = await supabase
          .from("admin")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (userError || userData?.role !== "admin") {
          await supabase.auth.signOut()
          router.push("/admin/login")
          return
        }

        // Check if property exists
        if (!propertyId) {
          setError("Invalid property ID")
          return
        }

        const { data: property, error: propertyError } = await supabase
          .from("properties")
          .select("id, title")
          .eq("id", propertyId)
          .single()

        if (propertyError || !property) {
          setError("Property not found")
          return
        }

        setPropertyExists(true)
      } catch (err) {
        console.error("Error checking property:", err)
        setError("Failed to load property. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndProperty()
  }, [router, supabase, propertyId])

  if (loading) {
    return (
      <AdminLayout title="Edit Property">
        <div className={styles.loadingContainer}>
          <Spinner size="large" />
          <p>Loading property...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Edit Property">
        <Alert variant="error">{error}</Alert>
      </AdminLayout>
    )
  }

  if (!propertyExists || !propertyId) {
    return (
      <AdminLayout title="Edit Property">
        <Alert variant="error">Property not found</Alert>
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
