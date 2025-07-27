
"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { UserPlus, Mail, User, Shield } from "lucide-react"
import styles from "./users.module.css"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function UsersPage() {
  const supabase = createClientComponentClient()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteFullName, setInviteFullName] = useState("")
  const [inviteRole, setInviteRole] = useState("admin")
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.from("admin").select("*").order("created_at", { ascending: false })
      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInviting(true)
    setError(null)
    setSuccess(null)

    if (!inviteEmail || !inviteFullName) {
      setError("Please provide a full name and email address to send an invitation.")
      setIsInviting(false)
      return
    }

    try {
      const response = await fetch("/api/admin/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          fullName: inviteFullName,
          role: inviteRole,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to send invitation.")
      }
      
      setSuccess(`Invitation sent successfully to ${inviteEmail}.`)
      setInviteEmail("")
      setInviteFullName("")
      fetchUsers() // Refresh the user list
    } catch (err: any) {
      console.error("Error inviting user:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsInviting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <AdminLayout title="User Management">
      <div className={styles.usersContainer}>
        {/* Invite User Form */}
        <div className={styles.inviteSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <UserPlus size={24} />
              <h2>Invite New Admin</h2>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardDescription}>
                Enter the details below to send an invitation email. The new user will be able to set their own
                password.
              </p>
              <form onSubmit={handleInviteUser} className={styles.inviteForm}>
                {error && <Alert variant="error">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="fullName">Full Name</label>
                    <div className={styles.inputWrapper}>
                      <User className={styles.inputIcon} />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={inviteFullName}
                        onChange={(e) => setInviteFullName(e.target.value)}
                        required
                        disabled={isInviting}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <div className={styles.inputWrapper}>
                      <Mail className={styles.inputIcon} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        disabled={isInviting}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="role">Role</label>
                    <div className={styles.inputWrapper}>
                      <Shield className={styles.inputIcon} />
                      <Select id="role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </Select>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <Button type="submit" disabled={isInviting}>
                      {isInviting ? <Spinner size="small" /> : <UserPlus size={16} />}
                      {isInviting ? "Sending Invite..." : "Send Invite"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className={styles.usersListSection}>
          <h2>Existing Users</h2>
          <div className={styles.tableWrapper}>
            {loading ? (
              <div className={styles.loadingState}>
                <Spinner size="large" />
                <p>Loading users...</p>
              </div>
            ) : (
              <table className={styles.usersTable}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.avatar}>{user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}</div>
                          <div className={styles.userInfo}>
                            <span className={styles.userName}>{user.full_name}</span>
                            <span className={styles.userEmail}>{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.roleBadge} ${styles[user.role]}`}>{user.role}</span>
                      </td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <div className={styles.actionsCell}>
                          <Button variant="outline" size="small" disabled>
                            Edit
                          </Button>
                          <Button variant="danger" size="small" disabled={user.role === 'superadmin'}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && users.length === 0 && (
              <div className={styles.emptyState}>
                <p>No users found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
