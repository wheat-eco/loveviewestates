"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import styles from "./AdminLayout.module.css"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const pathname = usePathname()

  // Mock user data - in a real app, this would come from authentication
  const user = {
    full_name: "Admin User",
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
            <li>
              <Link href="/admin/logout">Logout</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>{title}</h1>

          <div className={styles.userInfo}>
            <span className={styles.userName}>Welcome, {user.full_name}</span>
            <Link href="/admin/logout" className={styles.logoutBtn}>
              <LogOut size={16} className="mr-1" /> Logout
            </Link>
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}
