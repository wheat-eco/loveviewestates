"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Home, Building, MapPin, Calendar, FileText } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import styles from "./AdminLayout.module.css"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

interface UserData {
  id: string
  full_name: string
  email: string
  role: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminInfo()
  }, [])

  const fetchAdminInfo = async () => {
    try {
      setLoading(true)

      // Get current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.error("No valid session:", sessionError)
        router.push("/admin/login")
        return
      }

      // Check if user has admin role in the "users" table (not "admin" table)
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, full_name, email, role")
        .eq("id", session.user.id)
        .single()

      if (userError) {
        console.error("Failed to fetch user info:", userError)
        router.push("/admin/login")
        return
      }

      if (!userData || (userData.role !== "admin" && userData.role !== "superadmin")) {
        console.error("Access denied. User role:", userData?.role)
        await supabase.auth.signOut()
        router.push("/admin/login")
        return
      }

      setUser(userData)
    } catch (error) {
      console.error("Error fetching admin info:", error)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

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
              <span className={styles.userRole}>{user.role}</span>
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
