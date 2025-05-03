"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AdminLayout from "@/components/admin/AdminLayout"
import { Home, Building, Calendar, FileText } from "lucide-react"
import styles from "./admin.module.css"

export default function AdminDashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableRentals: 0,
    availableSales: 0,
    pendingViewings: 0,
    pendingValuations: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/admin/login")
        return
      }

      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.session.user.id)
        .single()

      if (userError || userData?.role !== "admin") {
        await supabase.auth.signOut()
        router.push("/admin/login")
        return
      }

      fetchDashboardStats()
    }

    checkAuth()
  }, [router, supabase])

  async function fetchDashboardStats() {
    setLoading(true)
    try {
      // Get total properties count
      const { count: totalProperties } = await supabase.from("properties").select("*", { count: "exact", head: true })

      // Get available rentals count
      const { count: availableRentals } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("property_category", "rent")
        .eq("status", "AVAILABLE")

      // Get available sales count
      const { count: availableSales } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("property_category", "sale")
        .eq("status", "FOR SALE")

      // Get pending viewings count
      const { count: pendingViewings } = await supabase
        .from("viewing_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      // Get pending valuations count
      const { count: pendingValuations } = await supabase
        .from("valuation_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      setStats({
        totalProperties: totalProperties || 0,
        availableRentals: availableRentals || 0,
        availableSales: availableSales || 0,
        pendingViewings: pendingViewings || 0,
        pendingValuations: pendingValuations || 0,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Dashboard">
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Building size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Properties</h3>
            <p className={styles.statValue}>{loading ? "Loading..." : stats.totalProperties}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Home size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Available Rentals</h3>
            <p className={styles.statValue}>{loading ? "Loading..." : stats.availableRentals}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Building size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Properties For Sale</h3>
            <p className={styles.statValue}>{loading ? "Loading..." : stats.availableSales}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Pending Viewings</h3>
            <p className={styles.statValue}>{loading ? "Loading..." : stats.pendingViewings}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Pending Valuations</h3>
            <p className={styles.statValue}>{loading ? "Loading..." : stats.pendingValuations}</p>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <button className={styles.actionButton} onClick={() => router.push("/admin/properties/add")}>
            Add New Property
          </button>
          <button className={styles.actionButton} onClick={() => router.push("/admin/viewing-requests")}>
            View Pending Requests
          </button>
          <button className={styles.actionButton} onClick={() => router.push("/admin/valuation-requests")}>
            View Valuation Requests
          </button>
          <button className={styles.actionButton} onClick={() => router.push("/admin/regions")}>
            Manage Regions & Areas
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
