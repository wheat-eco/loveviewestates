
"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Property, ViewingRequest, ValuationRequest, ContactInquiry } from "@/lib/supabase-client"
import { Home, Eye, BarChart, Clock, Plus, ArrowRight, UserPlus, Bell } from "lucide-react"
import styles from "./admin.module.css"
import Link from "next/link"

interface Stats {
  totalProperties: number
  availableProperties: number
  pendingRequests: number
  totalUsers: number
}

export default function AdminDashboard() {
  const supabase = createClientComponentClient()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentProperties, setRecentProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { count: totalProperties } = await supabase.from("properties").select("*", { count: "exact", head: true })
        const { count: availableProperties } = await supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "available")
        const { count: pendingViewing } = await supabase.from("viewing_requests").select("*", { count: "exact", head: true }).eq("status", "pending")
        const { count: pendingValuation } = await supabase.from("valuation_requests").select("*", { count: "exact", head: true }).eq("status", "pending")
        const { count: newContact } = await supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new")
        const { count: totalUsers } = await supabase.from("admin").select("*", { count: "exact", head: true })

        const { data: recentProps } = await supabase
          .from("properties")
          .select("id, title, status, created_at, property_categories(display_name)")
          .order("created_at", { ascending: false })
          .limit(5)

        setStats({
          totalProperties: totalProperties || 0,
          availableProperties: availableProperties || 0,
          pendingRequests: (pendingViewing || 0) + (pendingValuation || 0) + (newContact || 0),
          totalUsers: totalUsers || 0,
        })
        setRecentProperties(recentProps as any || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { title: 'Total Properties', value: stats?.totalProperties, icon: Home, color: 'blue', link: '/admin/properties' },
    { title: 'Available Properties', value: stats?.availableProperties, icon: Eye, color: 'green', link: '/admin/properties?status=available' },
    { title: 'Pending Requests', value: stats?.pendingRequests, icon: Bell, color: 'orange', link: '/admin/requests' },
    { title: 'Admin Users', value: stats?.totalUsers, icon: UserPlus, color: 'purple', link: '/admin/users' },
  ]
  
  const quickActions = [
      { title: 'Add New Property', description: 'Create a new property listing', icon: Plus, color: 'blue', link: '/admin/properties/add' },
      { title: 'Manage Requests', description: 'View and handle user inquiries', icon: Bell, color: 'orange', link: '/admin/requests'},
      { title: 'Manage Users', description: 'Invite and manage admin users', icon: UserPlus, color: 'purple', link: '/admin/users' },
  ]

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading dashboard data...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Dashboard">
      <div className={styles.dashboardContainer}>
        <div className={styles.statsGrid}>
            {statCards.map(card => (
                <Link key={card.title} href={card.link} className={`${styles.statCard} ${styles[`stat${card.color}`]}`}>
                    <div className={styles.statHeader}>
                      <div className={styles.statContent}>
                        <h3>{card.title}</h3>
                        <p className={styles.statValue}>{card.value ?? '...'}</p>
                      </div>
                      <card.icon size={28} className={styles.statIcon} />
                    </div>
                </Link>
            ))}
        </div>

        <div className={styles.quickActionsSection}>
            <h2>Quick Actions</h2>
            <div className={styles.quickActionsGrid}>
                {quickActions.map(action => (
                    <Link key={action.title} href={action.link} className={`${styles.actionCard} ${styles[`action${action.color}`]}`}>
                        <div className={styles.actionIcon}>
                          <action.icon size={24} />
                        </div>
                        <div className={styles.actionContent}>
                            <h3>{action.title}</h3>
                            <p>{action.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        <div className={styles.recentActivitySection}>
          <h2>Recent Property Activity</h2>
          {recentProperties.length > 0 ? (
            <div className={styles.activityList}>
              {recentProperties.map(prop => (
                <div key={prop.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <Home size={20} />
                  </div>
                  <div className={styles.activityContent}>
                    <h4>{prop.title}</h4>
                    <p>{prop.property_categories?.display_name || 'Property'} added on {new Date(prop.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`${styles.activityStatus} ${styles[`status${prop.status}`]}`}>{prop.status.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No recent property activity.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
