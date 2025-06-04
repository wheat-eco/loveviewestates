"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  type PropertyCategory,
  type PropertyType,
  type Region,
  type Area,
  fetchRegions,
  fetchAreasByRegion,
  fetchPropertyCategories,
  fetchPropertyTypesByCategory,
  uploadPropertyImage,
  uploadPropertyDocument,
} from "@/lib/supabase-client"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BasicDetailsForm,
  LocationForm,
  FeaturesForm,
  ImagesForm,
  DocumentsForm,
  RentalDetailsForm,
  SaleDetailsForm,
} from "./property-form"
import { CreateRegionModal } from "../regions/CreateRegionModal"
import { CreateAreaModal } from "../regions/CreateAreaModal"
import { CreatePropertyTypeModal } from "./CreatePropertyTypeModal"
import styles from "./PropertyForm.module.css"

interface PropertyFormProps {
  mode: "create" | "edit"
  propertyId?: number
}

export default function PropertyForm({ mode, propertyId }: PropertyFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Form state
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Data state
  const [categories, setCategories] = useState<PropertyCategory[]>([])
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)

  // Modal state
  const [showRegionModal, setShowRegionModal] = useState(false)
  const [showAreaModal, setShowAreaModal] = useState(false)
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    // Basic details
    title: "",
    description: "",
    category_id: "",
    property_type_id: "",
    bedrooms: "1",
    bathrooms: "1",
    reception_rooms: "0",
    price: "",
    price_qualifier: "",
    rent_frequency: "monthly",
    status: "available",
    available_date: "",
    featured: false,

    // Location
    region_id: "",
    area_id: "",
    address: "",
    postcode: "",
    latitude: "",
    longitude: "",

    // Features
    features: [] as string[],

    // Rental details
    furnished_status: "",
    deposit_amount: "",
    pets_policy: "",
    smoking_policy: "",
    minimum_tenancy: "",
    maximum_tenancy: "",

    // Sale details
    tenure: "",
    lease_remaining: "",
    service_charge: "",
    ground_rent: "",

    // Common details
    epc_rating: "",
    council_tax_band: "",
    year_built: "",
    construction_type: "",
    heating_type: "",
    parking: "",
    garden: "",

    // SEO
    meta_title: "",
    meta_description: "",
    keywords: [] as string[],
  })

  // File state
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [documents, setDocuments] = useState<{
    [key: string]: File | null
  }>({
    epc: null,
    floorplan: null,
    brochure: null,
  })

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        // Fetch categories, regions
        const [categoriesData, regionsData] = await Promise.all([fetchPropertyCategories(), fetchRegions()])

        setCategories(categoriesData)
        setRegions(regionsData)

        // If editing, load property data
        if (mode === "edit" && propertyId) {
          await loadPropertyData(propertyId)
        }
      } catch (err) {
        console.error("Error loading initial data:", err)
        setError("Failed to load form data. Please refresh the page.")
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [mode, propertyId])

  // Load property types when category changes
  useEffect(() => {
    const loadPropertyTypes = async () => {
      if (!formData.category_id) {
        setPropertyTypes([])
        return
      }

      try {
        const types = await fetchPropertyTypesByCategory(Number(formData.category_id))
        setPropertyTypes(types)

        // Reset property type if not available in new category
        if (formData.property_type_id && !types.some((t) => t.id === Number(formData.property_type_id))) {
          setFormData((prev) => ({ ...prev, property_type_id: "" }))
        }
      } catch (err) {
        console.error("Error loading property types:", err)
      }
    }

    loadPropertyTypes()
  }, [formData.category_id])

  // Load areas when region changes
  useEffect(() => {
    const loadAreas = async () => {
      if (!formData.region_id) {
        setAreas([])
        return
      }

      try {
        const areasData = await fetchAreasByRegion(Number(formData.region_id))
        setAreas(areasData)

        // Reset area if not available in new region
        if (formData.area_id && !areasData.some((a) => a.id === Number(formData.area_id))) {
          setFormData((prev) => ({ ...prev, area_id: "" }))
        }
      } catch (err) {
        console.error("Error loading areas:", err)
      }
    }

    loadAreas()
  }, [formData.region_id])

  // Load property data for edit mode
  const loadPropertyData = async (id: number) => {
    try {
      const { data: property, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_details(*),
          property_features(id, feature_name, feature_category),
          property_images(*)
        `)
        .eq("id", id)
        .single()

      if (error) throw error
      if (!property) throw new Error("Property not found")

      // Set form data from property
      setFormData({
        // Basic details
        title: property.title || "",
        description: property.description || "",
        category_id: property.category_id?.toString() || "",
        property_type_id: property.property_type_id?.toString() || "",
        bedrooms: property.bedrooms?.toString() || "1",
        bathrooms: property.bathrooms?.toString() || "1",
        reception_rooms: property.reception_rooms?.toString() || "0",
        price: property.price?.toString() || "",
        price_qualifier: property.price_qualifier || "",
        rent_frequency: property.rent_frequency || "monthly",
        status: property.status || "available",
        available_date: property.available_date || "",
        featured: property.featured || false,

        // Location
        region_id: property.areas?.region_id?.toString() || "",
        area_id: property.area_id?.toString() || "",
        address: property.address || "",
        postcode: property.postcode || "",
        latitude: property.latitude?.toString() || "",
        longitude: property.longitude?.toString() || "",

        // Features
        features: property.property_features?.map((f) => f.feature_name) || [],

        // Rental details
        furnished_status: property.property_details?.furnished_status || "",
        deposit_amount: property.property_details?.deposit_amount?.toString() || "",
        pets_policy: property.property_details?.pets_policy || "",
        smoking_policy: property.property_details?.smoking_policy || "",
        minimum_tenancy: property.property_details?.minimum_tenancy?.toString() || "",
        maximum_tenancy: property.property_details?.maximum_tenancy?.toString() || "",

        // Sale details
        tenure: property.property_details?.tenure || "",
        lease_remaining: property.property_details?.lease_remaining?.toString() || "",
        service_charge: property.property_details?.service_charge?.toString() || "",
        ground_rent: property.property_details?.ground_rent?.toString() || "",

        // Common details
        epc_rating: property.property_details?.epc_rating || "",
        council_tax_band: property.property_details?.council_tax_band || "",
        year_built: property.property_details?.year_built?.toString() || "",
        construction_type: property.property_details?.construction_type || "",
        heating_type: property.property_details?.heating_type || "",
        parking: property.property_details?.parking || "",
        garden: property.property_details?.garden || "",

        // SEO
        meta_title: property.meta_title || "",
        meta_description: property.meta_description || "",
        keywords: property.keywords || [],
      })

      // Load existing images
      if (property.property_images && property.property_images.length > 0) {
        setImagePreviewUrls(property.property_images.map((img) => img.image_url))
      }

      // Load existing documents
      // This would require fetching documents from property_documents table
    } catch (err) {
      console.error("Error loading property data:", err)
      setError("Failed to load property data. Please try again.")
    }
  }

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle feature changes
  const handleFeatureChange = (features: string[]) => {
    setFormData((prev) => ({ ...prev, features }))
  }

  // Handle keywords changes
  const handleKeywordsChange = (keywords: string[]) => {
    setFormData((prev) => ({ ...prev, keywords }))
  }

  // Handle image changes
  const handleImageChange = (files: File[]) => {
    setImageFiles(files)

    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file))
    setImagePreviewUrls(previewUrls)
  }

  // Handle document changes
  const handleDocumentChange = (type: string, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [type]: file }))
  }

  // Handle region creation
  const handleRegionCreated = async (region: Region) => {
    setRegions((prev) => [...prev, region])
    setFormData((prev) => ({ ...prev, region_id: region.id.toString() }))
    setShowRegionModal(false)
  }

  // Handle area creation
  const handleAreaCreated = async (area: Area) => {
    setAreas((prev) => [...prev, area])
    setFormData((prev) => ({ ...prev, area_id: area.id.toString() }))
    setShowAreaModal(false)
  }

  // Handle property type creation
  const handlePropertyTypeCreated = async (propertyType: PropertyType) => {
    setPropertyTypes((prev) => [...prev, propertyType])
    setFormData((prev) => ({ ...prev, property_type_id: propertyType.id.toString() }))
    setShowPropertyTypeModal(false)
  }

  // Validate form before submission
  const validateForm = () => {
    // Basic validation
    if (!formData.title) return "Property title is required"
    if (!formData.category_id) return "Property category is required"
    if (!formData.property_type_id) return "Property type is required"
    if (!formData.price) return "Price is required"
    if (!formData.bedrooms) return "Number of bedrooms is required"
    if (!formData.bathrooms) return "Number of bathrooms is required"

    // Location validation
    if (!formData.region_id) return "Region is required"
    if (!formData.area_id) return "Area is required"
    if (!formData.address) return "Address is required"
    if (!formData.postcode) return "Postcode is required"

    // Category-specific validation
    const category = categories.find((c) => c.id === Number(formData.category_id))

    if (category?.name === "rent") {
      // Rental-specific validation
      if (!formData.furnished_status) return "Furnished status is required for rental properties"
      if (!formData.available_date) return "Available date is required for rental properties"
    } else if (category?.name === "sale") {
      // Sale-specific validation
      if (!formData.tenure) return "Tenure is required for properties for sale"
    }

    // Image validation for new properties
    if (mode === "create" && imageFiles.length === 0) {
      return "At least one property image is required"
    }

    return null
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Generate slug from title
      let slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

      // Check if slug exists
      const { data: existingSlug } = await supabase.from("properties").select("id").eq("slug", slug).single()

      if (existingSlug && mode === "create") {
        // Append random string to make slug unique
        slug += `-${Math.random().toString(36).substring(2, 8)}`
      }

      let propertyId: number

      if (mode === "create") {
        // Insert property
        const { data: property, error: propertyError } = await supabase
          .from("properties")
          .insert({
            title: formData.title,
            slug,
            description: formData.description,
            area_id: Number(formData.area_id),
            address: formData.address,
            postcode: formData.postcode,
            latitude: formData.latitude ? Number(formData.latitude) : null,
            longitude: formData.longitude ? Number(formData.longitude) : null,
            category_id: Number(formData.category_id),
            property_type_id: Number(formData.property_type_id),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            reception_rooms: formData.reception_rooms ? Number(formData.reception_rooms) : null,
            price: Number(formData.price),
            price_qualifier: formData.price_qualifier || null,
            rent_frequency: formData.rent_frequency || null,
            available_date: formData.available_date || null,
            status: formData.status,
            featured: formData.featured,
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            keywords: formData.keywords.length > 0 ? formData.keywords : null,
            published_at: new Date().toISOString(),
          })
          .select()

        if (propertyError) throw propertyError
        propertyId = property[0].id
      } else {
        // Update property
        const { error: propertyError } = await supabase
          .from("properties")
          .update({
            title: formData.title,
            slug,
            description: formData.description,
            area_id: Number(formData.area_id),
            address: formData.address,
            postcode: formData.postcode,
            latitude: formData.latitude ? Number(formData.latitude) : null,
            longitude: formData.longitude ? Number(formData.longitude) : null,
            category_id: Number(formData.category_id),
            property_type_id: Number(formData.property_type_id),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            reception_rooms: formData.reception_rooms ? Number(formData.reception_rooms) : null,
            price: Number(formData.price),
            price_qualifier: formData.price_qualifier || null,
            rent_frequency: formData.rent_frequency || null,
            available_date: formData.available_date || null,
            status: formData.status,
            featured: formData.featured,
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            keywords: formData.keywords.length > 0 ? formData.keywords : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", propertyId!)

        if (propertyError) throw propertyError
      }

      // Insert or update property details
      const propertyDetailsData: any = {}

      // Get category
      const category = categories.find((c) => c.id === Number(formData.category_id))

      // Add category-specific fields
      if (category?.name === "rent") {
        // Rental-specific fields
        propertyDetailsData.furnished_status = formData.furnished_status || null
        propertyDetailsData.deposit_amount = formData.deposit_amount ? Number(formData.deposit_amount) : null
        propertyDetailsData.pets_policy = formData.pets_policy || null
        propertyDetailsData.smoking_policy = formData.smoking_policy || null
        propertyDetailsData.minimum_tenancy = formData.minimum_tenancy ? Number(formData.minimum_tenancy) : null
        propertyDetailsData.maximum_tenancy = formData.maximum_tenancy ? Number(formData.maximum_tenancy) : null
      } else if (category?.name === "sale") {
        // Sale-specific fields
        propertyDetailsData.tenure = formData.tenure || null
        propertyDetailsData.lease_remaining = formData.lease_remaining ? Number(formData.lease_remaining) : null
        propertyDetailsData.service_charge = formData.service_charge ? Number(formData.service_charge) : null
        propertyDetailsData.ground_rent = formData.ground_rent ? Number(formData.ground_rent) : null
      }

      // Common fields
      propertyDetailsData.epc_rating = formData.epc_rating || null
      propertyDetailsData.council_tax_band = formData.council_tax_band || null
      propertyDetailsData.year_built = formData.year_built ? Number(formData.year_built) : null
      propertyDetailsData.construction_type = formData.construction_type || null
      propertyDetailsData.heating_type = formData.heating_type || null
      propertyDetailsData.parking = formData.parking || null
      propertyDetailsData.garden = formData.garden || null

      if (mode === "create") {
        // Insert property details
        propertyDetailsData.property_id = propertyId

        const { error: detailsError } = await supabase.from("property_details").insert(propertyDetailsData)

        if (detailsError) throw detailsError
      } else {
        // Update property details
        const { error: detailsError } = await supabase
          .from("property_details")
          .update(propertyDetailsData)
          .eq("property_id", propertyId!)

        if (detailsError) throw detailsError
      }

      // Insert property features
      if (formData.features.length > 0) {
        // Delete existing features if updating
        if (mode === "edit") {
          await supabase.from("property_features").delete().eq("property_id", propertyId!)
        }

        // Insert new features
        const featuresData = formData.features.map((feature, index) => ({
          property_id: propertyId,
          feature_name: feature,
          display_order: index,
        }))

        const { error: featuresError } = await supabase.from("property_features").insert(featuresData)

        if (featuresError) throw featuresError
      }

      // Upload images
      if (imageFiles.length > 0) {
        let featuredImageSet = false

        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i]

          try {
            const imageUrl = await uploadPropertyImage(file, propertyId)

            // Insert image record
            const { error: imageError } = await supabase.from("property_images").insert({
              property_id: propertyId,
              image_url: imageUrl,
              image_type: "general",
              is_featured: !featuredImageSet,
              display_order: i,
            })

            if (imageError) throw imageError

            if (!featuredImageSet) featuredImageSet = true
          } catch (err) {
            console.error(`Error uploading image ${i}:`, err)
            // Continue with other images
          }
        }
      }

      // Upload documents
      for (const [docType, file] of Object.entries(documents)) {
        if (file) {
          try {
            const documentUrl = await uploadPropertyDocument(file, propertyId, docType)

            // Insert document record
            const { error: docError } = await supabase.from("property_documents").insert({
              property_id: propertyId,
              document_name:
                docType === "epc"
                  ? "Energy Performance Certificate"
                  : docType === "floorplan"
                    ? "Floor Plan"
                    : "Property Brochure",
              document_url: documentUrl,
              document_type: docType.toUpperCase(),
              is_public: true,
            })

            if (docError) throw docError
          } catch (err) {
            console.error(`Error uploading document ${docType}:`, err)
            // Continue with other documents
          }
        }
      }

      setSuccess(mode === "create" ? "Property created successfully!" : "Property updated successfully!")

      // Redirect after a delay
      setTimeout(() => {
        router.push("/admin/properties")
      }, 2000)
    } catch (err) {
      console.error("Error submitting property:", err)
      setError(err instanceof Error ? err.message : "An error occurred while saving the property")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" />
        <p>Loading form data...</p>
      </div>
    )
  }

  // Get selected category
  const selectedCategory = categories.find((c) => c.id === Number(formData.category_id))

  return (
    <div className={styles.formContainer}>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.formTabs}>
          <TabsList>
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            {selectedCategory?.name === "rent" && <TabsTrigger value="rental">Rental Details</TabsTrigger>}
            {selectedCategory?.name === "sale" && <TabsTrigger value="sale">Sale Details</TabsTrigger>}
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicDetailsForm
              formData={formData}
              categories={categories}
              propertyTypes={propertyTypes}
              onChange={handleChange}
              onCheckboxChange={handleCheckboxChange}
              onCreatePropertyType={() => setShowPropertyTypeModal(true)}
            />
          </TabsContent>

          <TabsContent value="location">
            <LocationForm
              formData={formData}
              regions={regions}
              areas={areas}
              onChange={handleChange}
              onCreateRegion={() => setShowRegionModal(true)}
              onCreateArea={() => setShowAreaModal(true)}
            />
          </TabsContent>

          {selectedCategory?.name === "rent" && (
            <TabsContent value="rental">
              <RentalDetailsForm formData={formData} onChange={handleChange} />
            </TabsContent>
          )}

          {selectedCategory?.name === "sale" && (
            <TabsContent value="sale">
              <SaleDetailsForm formData={formData} onChange={handleChange} />
            </TabsContent>
          )}

          <TabsContent value="features">
            <FeaturesForm features={formData.features} onChange={handleFeatureChange} />
          </TabsContent>

          <TabsContent value="images">
            <ImagesForm imageFiles={imageFiles} previewUrls={imagePreviewUrls} onChange={handleImageChange} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsForm
              documents={documents}
              onChange={handleDocumentChange}
              propertyCategory={selectedCategory?.name || ""}
            />
          </TabsContent>
        </Tabs>

        <div className={styles.formActions}>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/properties")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="small" />
                {mode === "create" ? "Creating Property..." : "Updating Property..."}
              </>
            ) : mode === "create" ? (
              "Create Property"
            ) : (
              "Update Property"
            )}
          </Button>
        </div>
      </form>

      {/* Modals */}
      <CreateRegionModal
        isOpen={showRegionModal}
        onClose={() => setShowRegionModal(false)}
        onRegionCreated={handleRegionCreated}
      />

      <CreateAreaModal
        isOpen={showAreaModal}
        onClose={() => setShowAreaModal(false)}
        regions={regions}
        selectedRegionId={formData.region_id ? Number(formData.region_id) : undefined}
        onAreaCreated={handleAreaCreated}
      />

      <CreatePropertyTypeModal
        isOpen={showPropertyTypeModal}
        onClose={() => setShowPropertyTypeModal(false)}
        categories={categories}
        selectedCategoryId={formData.category_id ? Number(formData.category_id) : undefined}
        onPropertyTypeCreated={handlePropertyTypeCreated}
      />
    </div>
  )
}
