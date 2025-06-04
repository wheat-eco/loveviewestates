"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  fetchPropertyCategories,
  fetchRegions,
  type Property,
  type PropertyCategory,
  type Region,
} from "@/lib/supabase-client"
import { Plus, Search, Edit, Eye, Trash2, Filter } from "lucide-react"
import styles from "./properties.module.css"

export default function PropertiesPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  // State
  const [properties, setProperties] = useState<Property[]>([])
  const [categories, setCategories] = useState<PropertyCategory[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProperties, setTotalProperties] = useState(0)
  const pageSize = 20

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData, regionsData] = await Promise.all([fetchPropertyCategories(), fetchRegions()])

        setCategories(categoriesData)
        setRegions(regionsData)
      } catch (err) {
        console.error("Error loading initial data:", err)
        setError("Failed to load page data")
      }
    }

    loadInitialData()
  }, [])

  // Load properties
  useEffect(() => {
    loadProperties()
  }, [currentPage, searchTerm, selectedCategory, selectedRegion, selectedStatus])

  const loadProperties = async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase.from("properties").select(
        `
          *,
          areas (
            id,
            name,
            regions (
              id,
              name
            )
          ),
          property_categories (
            id,
            display_name
          ),
          property_types (
            id,
            display_name
          ),
          property_images (
            id,
            image_url,
            is_featured
          )
        `,
        { count: "exact" },
      )

      // Apply filters
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,postcode.ilike.%${searchTerm}%`)
      }

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory)
      }

      if (selectedRegion) {
        query = query.eq("areas.region_id", selectedRegion)
      }

      if (selectedStatus) {
        query = query.eq("status", selectedStatus)
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)

      if (error) throw error

      setProperties(data || [])
      setTotalProperties(count || 0)
      setTotalPages(Math.ceil((count || 0) / pageSize))
    } catch (err) {
      console.error("Error loading properties:", err)
      setError("Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("properties").delete().eq("id", propertyId)

      if (error) throw error

      // Reload properties
      loadProperties()
    } catch (err) {
      console.error("Error deleting property:", err)
      setError("Failed to delete property")
    }
  }

  const getFeaturedImage = (property: Property) => {
    const featuredImage = property.property_images?.find((img) => img.is_featured)
    return featuredImage?.image_url || property.property_images?.[0]?.image_url || "/placeholder.svg"
  }

  const formatPrice = (price: number, category: string, frequency?: string) => {
    const formatted = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)

    if (category === "rent" && frequency) {
      return `${formatted} ${frequency === "monthly" ? "pcm" : `per ${frequency}`}`
    }

    return formatted
  }

  return (
    <AdminLayout title="Properties">
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1>Properties</h1>
            <p>Manage your property listings</p>
          </div>
          <Button onClick={() => router.push("/admin/properties/add")}>
            <Plus size={16} />
            Add Property
          </Button>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filtersGrid}>
          <div className={styles.searchGroup}>
            <Search size={16} className={styles.searchIcon} />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.display_name}
              </option>
            ))}
          </Select>

          <Select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Select>

          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="under_offer">Under Offer</option>
            <option value="let_agreed">Let Agreed</option>
            <option value="sold">Sold</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="draft">Draft</option>
          </Select>
        </div>

        <div className={styles.resultsInfo}>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalProperties)} of{" "}
              {totalProperties} properties
            </span>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spinner size="large" />
          <p>Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Filter size={48} />
          </div>
          <h3>No properties found</h3>
          <p>
            {searchTerm || selectedCategory || selectedRegion || selectedStatus
              ? "Try adjusting your filters or search terms"
              : "Get started by adding your first property"}
          </p>
          <Button onClick={() => router.push("/admin/properties/add")}>
            <Plus size={16} />
            Add Property
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.propertiesGrid}>
            {properties.map((property) => (
              <div key={property.id} className={styles.propertyCard}>
                <div className={styles.propertyImage}>
                  <img
                    src={getFeaturedImage(property) || "/placeholder.svg"}
                    alt={property.title}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                  {property.featured && <div className={styles.featuredBadge}>Featured</div>}
                  <div className={styles.statusBadge} data-status={property.status}>
                    {property.status.replace("_", " ")}
                  </div>
                </div>

                <div className={styles.propertyContent}>
                  <div className={styles.propertyHeader}>
                    <h3 className={styles.propertyTitle}>{property.title}</h3>
                    <div className={styles.propertyPrice}>
                      {formatPrice(
                        property.price,
                        property.property_categories?.display_name?.toLowerCase() || "",
                        property.rent_frequency,
                      )}
                    </div>
                  </div>

                  <div className={styles.propertyMeta}>
                    <span className={styles.propertyType}>{property.property_types?.display_name}</span>
                    <span className={styles.propertyLocation}>
                      {property.areas?.name}, {property.areas?.regions?.name}
                    </span>
                  </div>

                  <div className={styles.propertyDetails}>
                    <span>{property.bedrooms} bed</span>
                    <span>{property.bathrooms} bath</span>
                    {property.reception_rooms && property.reception_rooms > 0 && (
                      <span>{property.reception_rooms} reception</span>
                    )}
                  </div>

                  <div className={styles.propertyActions}>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => router.push(`/admin/properties/view/${property.id}`)}
                    >
                      <Eye size={14} />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => router.push(`/admin/properties/edit/${property.id}`)}
                    >
                      <Edit size={14} />
                      Edit
                    </Button>
                    <Button variant="danger" size="small" onClick={() => handleDeleteProperty(property.id)}>
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </Button>

              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  )
}
