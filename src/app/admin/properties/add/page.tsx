"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import PropertyForm from "@/components/admin/properties/PropertyForm"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import styles from "./add-property.module.css"

export default function AddPropertyPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
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

        setLoading(false)
      } catch (err) {
        console.error("Authentication error:", err)
        setError("Authentication failed. Please log in again.")
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <AdminLayout title="Add New Property">
        <div className={styles.loadingContainer}>
          <Spinner size="large" />
          <p>Loading property form...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Add New Property">
        <Alert variant="error">{error}</Alert>
      </AdminLayout>
    )
  }

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
