"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchPropertyById, deleteProperty, type Property } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Modal } from "@/components/ui/Modal"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  Edit,
  Trash2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  Star,
  Home,
} from "lucide-react"
import styles from "./property-view.module.css"

export default function PropertyViewPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = Number.parseInt(params.id as string)

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    loadProperty()
  }, [propertyId])

  const loadProperty = async () => {
    try {
      setLoading(true)
      const data = await fetchPropertyById(propertyId)
      setProperty(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load property")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteProperty(propertyId)
      router.push("/admin/properties")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete property")
    } finally {
      setDeleting(false)
      setDeleteModalOpen(false)
    }
  }

  const formatPrice = (price: number, category?: string, frequency?: string) => {
    const formatted = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)

    if (category === "rent" && frequency) {
      return `${formatted} ${frequency}`
    }
    return formatted
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  const getAltText = (image: any, title: string) => {
    return image.alt_text || image.caption || `${title} - ${image.room_type || 'Image'}`
  }

  if (loading) {
    return (
      <AdminLayout title="Property Details">
        <div className={styles.loading}>
          <Spinner size="large" />
          <p>Loading property...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error || !property) {
    return (
      <AdminLayout title="Error">
        <Alert variant="error">
          {error || "Property not found"}
        </Alert>
        <Button onClick={() => router.push("/admin/properties")} className={styles.backButton}>
          <ArrowLeft size={16} />
          Back to Properties
        </Button>
      </AdminLayout>
    )
  }

  const featuredImage = property.property_images?.find((img) => img.is_featured) || property.property_images?.[0]

  return (
    <AdminLayout title="Property Details">
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button variant="ghost" onClick={() => router.push("/admin/properties")} className={styles.backButton}>
            <ArrowLeft size={16} />
            Back to Properties
          </Button>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{property.title}</h1>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles[property.status]}`}>{property.status.replace('_', ' ')}</span>
              {property.featured && (
                <span className={`${styles.badge} ${styles.featured}`}>
                  <Star size={12} />
                  Featured
                </span>
              )}
              <span className={styles.badge}>{property.property_categories?.display_name}</span>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button onClick={() => router.push(`/admin/properties/edit/${property.id}`)} className={styles.editButton}>
            <Edit size={16} />
            Edit Property
          </Button>
          <Button variant="danger" onClick={() => setDeleteModalOpen(true)} className={styles.deleteButton}>
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Image Gallery */}
          {property.property_images && property.property_images.length > 0 && (
            <div className={styles.imageSection}>
              <div className={styles.featuredImage}>
                <img
                  src={featuredImage?.image_url || "https://placehold.co/600x400.png"}
                  alt={getAltText(featuredImage, property.title)}
                  onClick={() => setSelectedImage(featuredImage?.image_url || null)}
                />
              </div>
              {property.property_images.length > 1 && (
                <div className={styles.imageGrid}>
                  {property.property_images.slice(0, 6).map((image, index) => (
                    <div
                      key={image.id}
                      className={styles.thumbnailWrapper}
                      onClick={() => setSelectedImage(image.image_url)}
                    >
                      <img
                        src={image.thumbnail_url || image.image_url}
                        alt={getAltText(image, property.title)}
                      />
                      {property.property_images!.length > 6 && index === 5 && (
                        <div className={styles.moreImages}>+{property.property_images!.length - 6} more</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div className={styles.section}>
              <h2>Description</h2>
              <div className={styles.description}>
                {property.description.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {property.property_features && property.property_features.length > 0 && (
            <div className={styles.section}>
              <h2>Features</h2>
              <div className={styles.features}>
                {property.property_features.map((feature) => (
                  <div key={feature.id} className={styles.feature}>
                    <span className={styles.featureName}>{feature.feature_name}</span>
                    {feature.feature_value && <span className={styles.featureValue}>{feature.feature_value}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {property.property_documents && property.property_documents.length > 0 && (
            <div className={styles.section}>
              <h2>Documents</h2>
              <div className={styles.documents}>
                {property.property_documents.map((doc) => (
                  <div key={doc.id} className={styles.document}>
                    <div className={styles.documentInfo}>
                      <FileText size={20} />
                      <div>
                        <h4>{doc.document_name}</h4>
                        <p>{doc.document_type}</p>
                        {doc.file_size && (
                          <span className={styles.fileSize}>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="small" onClick={() => window.open(doc.document_url, "_blank")}>
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Price & Key Details */}
          <div className={styles.priceCard}>
            <div className={styles.price}>
              {formatPrice(property.price, property.property_categories?.name, property.rent_frequency)}
            </div>
            {property.price_qualifier && <div className={styles.priceQualifier}>{property.price_qualifier}</div>}

            <div className={styles.keyDetails}>
              <div className={styles.detail}>
                <Bed size={16} />
                <span>
                  {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
                </span>
              </div>
              <div className={styles.detail}>
                <Bath size={16} />
                <span>
                  {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
                </span>
              </div>
              {property.reception_rooms && (
                <div className={styles.detail}>
                  <Home size={16} />
                  <span>{property.reception_rooms} reception</span>
                </div>
              )}
              {property.floor_area && (
                <div className={styles.detail}>
                  <Square size={16} />
                  <span>{property.floor_area} sq ft</span>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className={styles.infoCard}>
            <h3>Location</h3>
            <div className={styles.location}>
              <MapPin size={16} />
              <div>
                <p>{property.address}</p>
                <p>{property.postcode}</p>
                <p>
                  {property.areas?.name}, {property.areas?.regions?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          {property.property_details && (
            <div className={styles.infoCard}>
              <h3>Property Details</h3>
              <div className={styles.detailsList}>
                {property.property_details.furnished_status && (
                  <div className={styles.detailItem}>
                    <span>Furnished:</span>
                    <span>{property.property_details.furnished_status}</span>
                  </div>
                )}
                {property.property_details.tenure && (
                  <div className={styles.detailItem}>
                    <span>Tenure:</span>
                    <span>{property.property_details.tenure}</span>
                  </div>
                )}
                {property.property_details.epc_rating && (
                  <div className={styles.detailItem}>
                    <span>EPC Rating:</span>
                    <span>{property.property_details.epc_rating}</span>
                  </div>
                )}
                {property.property_details.council_tax_band && (
                  <div className={styles.detailItem}>
                    <span>Council Tax:</span>
                    <span>Band {property.property_details.council_tax_band}</span>
                  </div>
                )}
                {property.property_details.year_built && (
                  <div className={styles.detailItem}>
                    <span>Year Built:</span>
                    <span>{property.property_details.year_built}</span>
                  </div>
                )}
                {property.property_details.parking && (
                  <div className={styles.detailItem}>
                    <span>Parking:</span>
                    <span>{property.property_details.parking}</span>
                  </div>
                )}
                {property.property_details.garden && (
                  <div className={styles.detailItem}>
                    <span>Garden:</span>
                    <span>{property.property_details.garden}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Availability */}
          {property.available_date && (
            <div className={styles.infoCard}>
              <h3>Availability</h3>
              <div className={styles.availability}>
                <Calendar size={16} />
                <span>Available from {formatDate(property.available_date)}</span>
              </div>
            </div>
          )}

          {/* Meta Information */}
          <div className={styles.infoCard}>
            <h3>Property Information</h3>
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span>Property Type:</span>
                <span>{property.property_types?.display_name}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Created:</span>
                <span>{formatDate(property.created_at)}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Last Updated:</span>
                <span>{formatDate(property.updated_at)}</span>
              </div>
              {property.published_at && (
                <div className={styles.detailItem}>
                  <span>Published:</span>
                  <span>{formatDate(property.published_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Property">
        <div className={styles.deleteModal}>
          <p>Are you sure you want to delete this property? This action cannot be undone.</p>
          <div className={styles.deleteModalActions}>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Spinner size="small" /> : <Trash2 size={16} />}
              {deleting ? "Deleting..." : "Delete Property"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Image Modal */}
      {selectedImage && (
        <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="Property Image" size="large">
          <div className={styles.imageModal}>
            <img src={selectedImage || "https://placehold.co/800x600.png"} alt={property.title} />
          </div>
        </Modal>
      )}
    </div>
    </AdminLayout>
  )
}
