"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AdminLayout from "@/components/admin/AdminLayout"
import { Home, Building, Calendar, FileText, TrendingUp, MapPin, Eye, Plus } from "lucide-react"
import styles from "./admin.module.css"

interface DashboardStats {
  totalProperties: number
  availableRentals: number
  availableSales: number
  pendingViewings: number
  pendingValuations: number
  totalRegions: number
  totalAreas: number
  recentProperties: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    availableRentals: 0,
    availableSales: 0,
    pendingViewings: 0,
    pendingValuations: 0,
    totalRegions: 0,
    totalAreas: 0,
    recentProperties: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    async function checkAuthAndFetchData() {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/admin/login")
        return
      }

      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from("admin")
        .select("role, is_active")
        .eq("id", data.session.user.id)
        .single()

      if (userError || userData?.role !== "admin" || !userData?.is_active) {
        await supabase.auth.signOut()
        router.push("/admin/login")
        return
      }

      await fetchDashboardData()
    }

    checkAuthAndFetchData()
  }, [router, supabase])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      // Fetch all stats in parallel
      const [
        propertiesCount,
        rentalsCount,
        salesCount,
        viewingsCount,
        valuationsCount,
        regionsCount,
        areasCount,
        recentPropertiesCount,
        recentActivityData,
      ] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("category_id", 1)
          .eq("status", "AVAILABLE"),
        supabase
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("category_id", 2)
          .eq("status", "FOR SALE"),
        supabase.from("viewing_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("valuation_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("regions").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("areas").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase
          .from("properties")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from("properties")
          .select(`
            id,
            title,
            status,
            created_at,
            property_categories(display_name),
            areas(name, regions(name))
          `)
          .order("created_at", { ascending: false })
          .limit(5),
      ])

      setStats({
        totalProperties: propertiesCount.count || 0,
        availableRentals: rentalsCount.count || 0,
        availableSales: salesCount.count || 0,
        pendingViewings: viewingsCount.count || 0,
        pendingValuations: valuationsCount.count || 0,
        totalRegions: regionsCount.count || 0,
        totalAreas: areasCount.count || 0,
        recentProperties: recentPropertiesCount.count || 0,
      })

      setRecentActivity(recentActivityData.data || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building,
      color: "blue",
      change: `+${stats.recentProperties} this week`,
      href: "/admin/properties",
    },
    {
      title: "Available Rentals",
      value: stats.availableRentals,
      icon: Home,
      color: "green",
      change: "Ready to rent",
      href: "/admin/properties?category=rent",
    },
    {
      title: "Properties For Sale",
      value: stats.availableSales,
      icon: TrendingUp,
      color: "purple",
      change: "On the market",
      href: "/admin/properties?category=sale",
    },
    {
      title: "Pending Viewings",
      value: stats.pendingViewings,
      icon: Calendar,
      color: "orange",
      change: "Awaiting response",
      href: "/admin/viewing-requests",
    },
    {
      title: "Pending Valuations",
      value: stats.pendingValuations,
      icon: FileText,
      color: "red",
      change: "Need attention",
      href: "/admin/valuation-requests",
    },
    {
      title: "Active Regions",
      value: stats.totalRegions,
      icon: MapPin,
      color: "indigo",
      change: `${stats.totalAreas} areas total`,
      href: "/admin/regions",
    },
  ]

  const quickActions = [
    {
      title: "Add New Property",
      description: "List a new property for rent or sale",
      icon: Plus,
      href: "/admin/properties/add",
      color: "blue",
    },
    {
      title: "View All Properties",
      description: "Manage existing property listings",
      icon: Building,
      href: "/admin/properties",
      color: "green",
    },
    {
      title: "Manage Regions",
      description: "Add or edit regions and areas",
      icon: MapPin,
      href: "/admin/regions",
      color: "purple",
    },
    {
      title: "Review Requests",
      description: "Handle viewing and valuation requests",
      icon: Eye,
      href: "/admin/viewing-requests",
      color: "orange",
    },
  ]

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Dashboard">
      <div className={styles.dashboardContainer}>
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <div key={index} className={`${styles.statCard} ${styles[`stat${stat.color}`]}`}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon}>
                  <stat.icon size={24} />
                </div>
                <div className={styles.statValue}>{loading ? "..." : stat.value.toLocaleString()}</div>
              </div>
              <div className={styles.statContent}>
                <h3>{stat.title}</h3>
                <p className={styles.statChange}>{stat.change}</p>
              </div>
              <button onClick={() => router.push(stat.href)} className={styles.statAction}>
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActionsSection}>
          <h2>Quick Actions</h2>
          <div className={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => router.push(action.href)}
                className={`${styles.actionCard} ${styles[`action${action.color}`]}`}
              >
                <div className={styles.actionIcon}>
                  <action.icon size={24} />
                </div>
                <div className={styles.actionContent}>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.recentActivitySection}>
          <h2>Recent Properties</h2>
          <div className={styles.activityList}>
            {recentActivity.length > 0 ? (
              recentActivity.map((property) => (
                <div key={property.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <Building size={16} />
                  </div>
                  <div className={styles.activityContent}>
                    <h4>{property.title}</h4>
                    <p>
                      {property.property_categories?.display_name} • {property.areas?.name},{" "}
                      {property.areas?.regions?.name}
                    </p>
                    <span className={styles.activityTime}>{new Date(property.created_at).toLocaleDateString()}</span>
                  </div>
                  <div
                    className={`${styles.activityStatus} ${styles[`status${property.status.toLowerCase().replace(/\s+/g, "")}`]}`}
                  >
                    {property.status}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <Building size={48} />
                <p>No recent properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
