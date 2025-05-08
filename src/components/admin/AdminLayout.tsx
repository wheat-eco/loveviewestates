"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
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
  const [user, setUser] = useState<{ full_name: string } | null>(null)
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
          setUser(null)
          return
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", authUser.id)
          .single()

        if (userError) {
          console.error("Error fetching user details:", userError)
          setUser(null)
          return
        }

        setUser(userData)
      } catch (error) {
        console.error("Error fetching admin info:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminInfo()
  }, [supabase])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (!user) {
    return <div className={styles.error}>Failed to load admin info. Please log in again.</div>
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Love View Estate</h2>
          <p>Admin Panel</p>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            <li>
              <Link href="/admin" className={pathname === "/admin" ? styles.active : ""}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/properties" className={pathname === "/admin/properties" ? styles.active : ""}>
                Properties
              </Link>
            </li>
            <li>
              <Link href="/admin/properties/add" className={pathname === "/admin/properties/add" ? styles.active : ""}>
                Add Property
              </Link>
            </li>
            <li>
              <Link href="/admin/regions" className={pathname === "/admin/regions" ? styles.active : ""}>
                Regions & Areas
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className={pathname === "/admin/users" ? styles.active : ""}>
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/viewing-requests"
                className={pathname === "/admin/viewing-requests" ? styles.active : ""}
              >
                Viewing Requests
              </Link>
            </li>
            <li>
              <Link
                href="/admin/valuation-requests"
                className={pathname === "/admin/valuation-requests" ? styles.active : ""}
              >
                Valuation Requests
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>{title}</h1>

          <div className={styles.userInfo}>
            <span className={styles.userName}>Welcome, {user.full_name}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={16} className="mr-1" /> Logout
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}
