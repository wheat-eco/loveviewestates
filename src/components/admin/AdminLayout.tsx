
"use client"

import Head from 'next/head'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import styles from './AdminLayout.module.css'
import {
    LayoutDashboard,
    Home,
    Map,
    MailQuestion,
    Users,
    Settings,
    LogOut,
    Building
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = "Admin" }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh(); // Ensure the layout re-renders and middleware kicks in
  };

  const navLinks = [
    { href: "/admin", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { href: "/admin/properties", icon: <Building size={18} />, label: "Properties" },
    { href: "/admin/regions", icon: <Map size={18} />, label: "Regions & Areas" },
    { href: "/admin/requests", icon: <MailQuestion size={18} />, label: "Requests" },
    { href: "/admin/users", icon: <Users size={18} />, label: "Users" },
    { href: "/admin/settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  return (
    <>
      <Head>
        <title>{title} | Love View Estate Admin</title>
      </Head>
      <div className={styles.adminLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Link href="/admin">
              <span className={styles.sidebarTitle}>Admin Panel</span>
            </Link>
          </div>
          <nav className={styles.sidebarNav}>
            {navLinks.map(link => (
                <Link key={link.href} href={link.href} className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}>
                    {link.icon}
                    <span>{link.label}</span>
                </Link>
            ))}
          </nav>
          <div className={styles.sidebarFooter}>
            <button onClick={handleLogout} className={styles.logoutButton}>
                <LogOut size={18} />
                <span>Logout</span>
            </button>
            <Link href="/" className={styles.viewSiteLink} target="_blank">
                <Home size={18}/>
                <span>View Site</span>
            </Link>
          </div>
        </aside>
        <div className={styles.mainContent}>
          <main className={styles.pageContent}>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
