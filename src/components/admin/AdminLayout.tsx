"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Home, Building, MapPin, Calendar, FileText, Users, Settings } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import styles from "./AdminLayout.module.css"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminInfo = async () => {
      setLoading(true)
      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !authUser) {
          console.error("Error fetching authenticated user:", authError)
          router.push("/admin/login")
          return
        }

        // Check if user has admin role
        const { data: userData, error: userError } = await supabase
          .from("admin")
          .select("full_name, email, role")
          .eq("id", authUser.id)
          .single()

        if (userError || userData?.role !== "admin") {
          console.error("User not authorized or not found:", userError)
          await supabase.auth.signOut()
          router.push("/admin/login")
          return
        }

        setUser({
          full_name: userData.full_name || authUser.email?.split("@")[0] || "Admin",
          email: userData.email || authUser.email || "",
        })
      } catch (error) {
        console.error("Error fetching admin info:", error)
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminInfo()
  }, [supabase, router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/admin/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading admin panel...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <p>Failed to load admin info. Please log in again.</p>
        <button onClick={() => router.push("/admin/login")} className={styles.loginButton}>
          Go to Login
        </button>
      </div>
    )
  }

  const navigationItems = [
    { href: "/admin", label: "Dashboard", icon: Home, exact: true },
    { href: "/admin/properties", label: "Properties", icon: Building },
    { href: "/admin/properties/add", label: "Add Property", icon: Building },
    { href: "/admin/regions", label: "Regions & Areas", icon: MapPin },
    { href: "/admin/viewing-requests", label: "Viewing Requests", icon: Calendar },
    { href: "/admin/valuation-requests", label: "Valuation Requests", icon: FileText },
    
  ]

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Love View Estate</h2>
          <p>Admin Panel</p>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {navigationItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

              return (
                <li key={item.href}>
                  <Link href={item.href} className={isActive ? styles.active : ""}>
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{user.full_name.charAt(0).toUpperCase()}</div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.full_name}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>{title}</h1>
          <div className={styles.headerActions}>
            <span className={styles.welcomeText}>Welcome back, {user.full_name}</span>
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
