"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Pencil, Eye, Trash2 } from "lucide-react"
import styles from "./admin-properties.module.css"
import { deleteProperty } from "./actions"

// Define property type
interface Property {
  id: number
  title: string
  slug: string
  property_type: string
  property_category: string
  price: number
  status: string
  bedrooms: number
  bathrooms: number
  areas: {
    id: string
    name: string
    regions: {
      id: string
      name: string
      slug: string
    }
  }
  property_images: {
    id: string
    image_url: string
    is_featured: boolean
  }[]
}

export default function PropertiesTable({ propertyType }: { propertyType: string }) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/properties?type=${propertyType}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setProperties(data.properties)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching properties:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [propertyType])

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case "available":
        return "Available"
      case "let_agreed":
        return "Let Agreed"
      case "let":
        return "Let"
      case "sale_agreed":
        return "Sale Agreed"
      case "sold":
        return "Sold"
      case "under_offer":
        return "Under Offer"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return styles.statusBadgeAvailable
      case "let_agreed":
      case "sale_agreed":
      case "under_offer":
        return styles.statusBadgePending
      case "let":
      case "sold":
        return styles.statusBadgeCompleted
      default:
        return styles.statusBadgeAvailable
    }
  }

  const handleDelete = async (propertyId: number) => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return
    }

    try {
      const formData = new FormData()
      formData.append("property_id", propertyId.toString())

      const result = await deleteProperty(formData)

      if (result.success) {
        // Remove the property from the local state
        setProperties(properties.filter((p) => p.id !== propertyId))
      } else {
        alert(result.message)
      }
    } catch (err) {
      console.error("Error deleting property:", err)
      alert("Failed to delete property")
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading properties...</div>
  }

  if (error) {
    return <div className={styles.alertDanger}>Error loading properties: {error}</div>
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Location</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties && properties.length > 0 ? (
            properties.map((property: Property) => {
              // Find featured image or use first image
              const featuredImage =
                property.property_images?.find((img) => img.is_featured)?.image_url ||
                property.property_images?.[0]?.image_url ||
                "/placeholder.svg?height=60&width=80"

              // Get area and region names
              const areaName = property.areas?.name || ""
              const regionName = property.areas?.regions?.name || ""

              return (
                <tr key={property.id}>
                  <td>
                    <div className={styles.propertyImageContainer}>
                      <Image
                        src={featuredImage || "/placeholder.svg"}
                        alt={property.title}
                        width={80}
                        height={60}
                        className={styles.propertyImage}
                      />
                    </div>
                  </td>
                  <td>{property.title}</td>
                  <td>
                    {areaName}, {regionName}
                  </td>
                  <td>{property.property_category === "rent" ? "For Rent" : "For Sale"}</td>
                  <td>£{property.price.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(property.status)}`}>
                      {formatStatus(property.status)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link
                        href={`/admin/properties/edit/${property.id}`}
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        title="Edit property"
                      >
                        <Pencil size={16} />
                      </Link>
                      <Link
                        href={`/property/${property.slug}`}
                        className={`${styles.btn} ${styles.btnInfo}`}
                        target="_blank"
                        title="View property"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        className={`${styles.btn} ${styles.btnDanger}`}
                        title="Delete property"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={7} className={styles.noResults}>
                No properties found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
