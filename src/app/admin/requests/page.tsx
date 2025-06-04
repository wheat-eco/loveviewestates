"use client"

import { useState, useEffect } from "react"
import {
  fetchViewingRequests,
  fetchValuationRequests,
  fetchContactInquiries,
  updateViewingRequestStatus,
  updateValuationRequestStatus,
  updateContactInquiryStatus,
  type ViewingRequest,
  type ValuationRequest,
  type ContactInquiry,
} from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Tabs } from "@/components/ui/tabs"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Modal } from "@/components/ui/Modal"
import { Textarea } from "@/components/ui/textarea"
import {
  Eye,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Home,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react"
import styles from "./requests.module.css"

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState("viewing")
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>([])
  const [valuationRequests, setValuationRequests] = useState<ValuationRequest[]>([])
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [estimatedValue, setEstimatedValue] = useState("")

  useEffect(() => {
    loadRequests()
  }, [activeTab, statusFilter])

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)

      if (activeTab === "viewing") {
        const { data } = await fetchViewingRequests({
          status: statusFilter || undefined,
          limit: 100,
        })
        setViewingRequests(data)
      } else if (activeTab === "valuation") {
        const { data } = await fetchValuationRequests({
          status: statusFilter || undefined,
          limit: 100,
        })
        setValuationRequests(data)
      } else if (activeTab === "contact") {
        const { data } = await fetchContactInquiries({
          status: statusFilter || undefined,
          limit: 100,
        })
        setContactInquiries(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request)
    setAdminNotes(request.admin_notes || "")
    setNewStatus(request.status)
    setEstimatedValue(request.estimated_value?.toString() || "")
    setModalOpen(true)
  }

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return

    try {
      setUpdating(true)

      if (activeTab === "viewing") {
        await updateViewingRequestStatus(selectedRequest.id, newStatus as ViewingRequest["status"], adminNotes)
      } else if (activeTab === "valuation") {
        await updateValuationRequestStatus(
          selectedRequest.id,
          newStatus as ValuationRequest["status"],
          adminNotes,
          estimatedValue ? Number.parseFloat(estimatedValue) : undefined,
        )
      } else if (activeTab === "contact") {
        await updateContactInquiryStatus(selectedRequest.id, newStatus as ContactInquiry["status"], adminNotes)
      }

      setModalOpen(false)
      loadRequests()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update request")
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className={styles.statusIconPending} />
      case "confirmed":
      case "scheduled":
      case "in_progress":
        return <Calendar size={16} className={styles.statusIconConfirmed} />
      case "completed":
      case "resolved":
        return <CheckCircle size={16} className={styles.statusIconCompleted} />
      case "cancelled":
      case "closed":
        return <XCircle size={16} className={styles.statusIconCancelled} />
      default:
        return <Clock size={16} className={styles.statusIconPending} />
    }
  }

  const getStatusOptions = () => {
    switch (activeTab) {
      case "viewing":
        return [
          { value: "pending", label: "Pending" },
          { value: "confirmed", label: "Confirmed" },
          { value: "completed", label: "Completed" },
          { value: "cancelled", label: "Cancelled" },
        ]
      case "valuation":
        return [
          { value: "pending", label: "Pending" },
          { value: "scheduled", label: "Scheduled" },
          { value: "completed", label: "Completed" },
          { value: "cancelled", label: "Cancelled" },
        ]
      case "contact":
        return [
          { value: "new", label: "New" },
          { value: "in_progress", label: "In Progress" },
          { value: "resolved", label: "Resolved" },
          { value: "closed", label: "Closed" },
        ]
      default:
        return []
    }
  }

  const filterRequests = (requests: any[]) => {
    if (!searchTerm) return requests

    return requests.filter(
      (request) =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.phone && request.phone.includes(searchTerm)) ||
        (request.properties?.title && request.properties.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.property_address && request.property_address.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  const getCurrentRequests = () => {
    switch (activeTab) {
      case "viewing":
        return filterRequests(viewingRequests)
      case "valuation":
        return filterRequests(valuationRequests)
      case "contact":
        return filterRequests(contactInquiries)
      default:
        return []
    }
  }

  const tabs = [
    { id: "viewing", label: "Viewing Requests", count: viewingRequests.length },
    { id: "valuation", label: "Valuation Requests", count: valuationRequests.length },
    { id: "contact", label: "Contact Inquiries", count: contactInquiries.length },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Request Management</h1>
        <p className={styles.subtitle}>Manage viewing requests, valuations, and contact inquiries</p>
      </div>

      {error && (
        <Alert type="error" title="Error" className={styles.alert}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <Input
            placeholder="Search by name, email, phone, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.statusFilter}>
          <option value="">All Statuses</option>
          {getStatusOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className={styles.tabs} />

      {/* Content */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <Spinner size="large" />
            <p>Loading requests...</p>
          </div>
        ) : (
          <div className={styles.requestsList}>
            {getCurrentRequests().length === 0 ? (
              <div className={styles.emptyState}>
                <MessageSquare size={48} />
                <h3>No requests found</h3>
                <p>
                  {searchTerm || statusFilter
                    ? "No requests match your current filters."
                    : `No ${activeTab} requests yet.`}
                </p>
              </div>
            ) : (
              getCurrentRequests().map((request) => (
                <div key={request.id} className={styles.requestCard}>
                  <div className={styles.requestHeader}>
                    <div className={styles.requestInfo}>
                      <h3>{request.name}</h3>
                      <div className={styles.contactInfo}>
                        <span className={styles.email}>
                          <Mail size={14} />
                          {request.email}
                        </span>
                        {request.phone && (
                          <span className={styles.phone}>
                            <Phone size={14} />
                            {request.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.requestMeta}>
                      <div className={styles.status}>
                        {getStatusIcon(request.status)}
                        <span className={`${styles.statusText} ${styles[request.status]}`}>
                          {request.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className={styles.date}>{formatDate(request.created_at)}</div>
                    </div>
                  </div>

                  <div className={styles.requestBody}>
                    {/* Viewing Request Details */}
                    {activeTab === "viewing" && (
                      <>
                        {request.properties && (
                          <div className={styles.propertyInfo}>
                            <Home size={16} />
                            <div>
                              <strong>{request.properties.title}</strong>
                              <p>
                                {request.properties.address}, {request.properties.postcode}
                              </p>
                              <p>{formatPrice(request.properties.price)}</p>
                            </div>
                          </div>
                        )}
                        <div className={styles.viewingDetails}>
                          <div className={styles.preferredTime}>
                            <Calendar size={16} />
                            <div>
                              <strong>Preferred:</strong> {new Date(request.preferred_date).toLocaleDateString()} at{" "}
                              {request.preferred_time}
                              {request.alternative_date && (
                                <div>
                                  <strong>Alternative:</strong>{" "}
                                  {new Date(request.alternative_date).toLocaleDateString()} at{" "}
                                  {request.alternative_time}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Valuation Request Details */}
                    {activeTab === "valuation" && (
                      <div className={styles.valuationDetails}>
                        <div className={styles.propertyInfo}>
                          <MapPin size={16} />
                          <div>
                            <strong>{request.property_address}</strong>
                            <p>{request.postcode}</p>
                            <p>
                              {request.property_type} • {request.bedrooms} bed • {request.bathrooms} bath
                            </p>
                          </div>
                        </div>
                        {request.estimated_value && (
                          <div className={styles.estimatedValue}>
                            <strong>Estimated Value:</strong> {formatPrice(request.estimated_value)}
                          </div>
                        )}
                        <div className={styles.contactPreference}>
                          <strong>Preferred Contact:</strong> {request.preferred_contact_method}
                        </div>
                      </div>
                    )}

                    {/* Contact Inquiry Details */}
                    {activeTab === "contact" && (
                      <div className={styles.contactDetails}>
                        <div className={styles.inquiryType}>
                          <strong>Type:</strong> {request.inquiry_type.replace("_", " ")}
                        </div>
                        {request.subject && (
                          <div className={styles.subject}>
                            <strong>Subject:</strong> {request.subject}
                          </div>
                        )}
                        {request.properties && (
                          <div className={styles.propertyInfo}>
                            <Home size={16} />
                            <span>{request.properties.title}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {request.message && (
                      <div className={styles.message}>
                        <strong>Message:</strong>
                        <p>{request.message}</p>
                      </div>
                    )}

                    {request.admin_notes && (
                      <div className={styles.adminNotes}>
                        <strong>Admin Notes:</strong>
                        <p>{request.admin_notes}</p>
                      </div>
                    )}
                  </div>

                  <div className={styles.requestActions}>
                    <Button variant="ghost" size="small" onClick={() => handleViewRequest(request)}>
                      <Eye size={16} />
                      View & Update
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Request Details`}
        size="large"
      >
        {selectedRequest && (
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{selectedRequest.name}</h3>
              <div className={styles.contactInfo}>
                <span>
                  <Mail size={14} /> {selectedRequest.email}
                </span>
                {selectedRequest.phone && (
                  <span>
                    <Phone size={14} /> {selectedRequest.phone}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.modalBody}>
              {/* Status Update */}
              <div className={styles.formGroup}>
                <label>Status</label>
                <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {getStatusOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Estimated Value (for valuations) */}
              {activeTab === "valuation" && (
                <div className={styles.formGroup}>
                  <label>Estimated Value (£)</label>
                  <Input
                    type="number"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    placeholder="Enter estimated value"
                  />
                </div>
              )}

              {/* Admin Notes */}
              <div className={styles.formGroup}>
                <label>Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={4}
                />
              </div>

              {/* Request Details */}
              <div className={styles.requestDetails}>
                <h4>Request Details</h4>

                {activeTab === "viewing" && selectedRequest.properties && (
                  <div className={styles.detailSection}>
                    <strong>Property:</strong>
                    <p>{selectedRequest.properties.title}</p>
                    <p>
                      {selectedRequest.properties.address}, {selectedRequest.properties.postcode}
                    </p>
                    <p>{formatPrice(selectedRequest.properties.price)}</p>
                  </div>
                )}

                {activeTab === "valuation" && (
                  <div className={styles.detailSection}>
                    <strong>Property Details:</strong>
                    <p>{selectedRequest.property_address}</p>
                    <p>{selectedRequest.postcode}</p>
                    <p>{selectedRequest.property_type}</p>
                    <p>
                      {selectedRequest.bedrooms} bedrooms, {selectedRequest.bathrooms} bathrooms
                    </p>
                    <p>Preferred contact: {selectedRequest.preferred_contact_method}</p>
                  </div>
                )}

                {selectedRequest.message && (
                  <div className={styles.detailSection}>
                    <strong>Message:</strong>
                    <p>{selectedRequest.message}</p>
                  </div>
                )}

                <div className={styles.detailSection}>
                  <strong>Submitted:</strong>
                  <p>{formatDate(selectedRequest.created_at)}</p>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={updating}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRequest} disabled={updating}>
                {updating ? <Spinner size="small" /> : null}
                {updating ? "Updating..." : "Update Request"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
