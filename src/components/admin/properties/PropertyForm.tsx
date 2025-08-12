
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  type PropertyCategory,
  type PropertyType,
  type Region,
  type Area,
  type PropertyImage,
  fetchRegions,
  fetchAreasByRegion,
  fetchPropertyCategories,
  fetchPropertyTypesByCategory,
  fetchPropertyById,
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
import { CreateRegionModal } from "@/components/admin/regions/CreateRegionModal"
import { CreateAreaModal } from "@/components/admin/regions/CreateAreaModal"
import { CreatePropertyTypeModal } from "./CreatePropertyTypeModal"
import { createProperty, updateProperty } from "@/app/admin/properties/actions"
import styles from "./PropertyForm.module.css"

interface PropertyFormProps {
  mode: "create" | "edit"
  propertyId?: number
}

export default function PropertyForm({ mode, propertyId }: PropertyFormProps) {
  const router = useRouter()

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
    available_date: new Date().toISOString().split("T")[0],
    featured: false,
    region_id: "",
    area_id: "",
    address: "",
    postcode: "",
    latitude: "",
    longitude: "",
    features: [] as string[],
    furnished_status: "",
    deposit_amount: "",
    pets_policy: "",
    smoking_policy: "",
    minimum_tenancy: "",
    maximum_tenancy: "",
    tenure: "",
    lease_remaining: "",
    service_charge: "",
    ground_rent: "",
    epc_rating: "",
    council_tax_band: "",
    year_built: "",
    construction_type: "",
    heating_type: "",
    parking: "",
    garden: "",
    meta_title: "",
    meta_description: "",
    keywords: [] as string[],
  })

  // File state
  const [images, setImages] = useState<(File | PropertyImage)[]>([])
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({
    epc: null,
    floorplan: null,
    brochure: null,
  })

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        const [categoriesData, regionsData] = await Promise.all([fetchPropertyCategories(), fetchRegions()])
        setCategories(categoriesData)
        setRegions(regionsData)

        if (mode === "edit" && propertyId) {
          const propertyData = await fetchPropertyById(propertyId)
          if (!propertyData) throw new Error("Property not found")

          setFormData({
            title: propertyData.title || "",
            description: propertyData.description || "",
            category_id: propertyData.category_id?.toString() || "",
            property_type_id: propertyData.property_type_id?.toString() || "",
            bedrooms: propertyData.bedrooms?.toString() || "1",
            bathrooms: propertyData.bathrooms?.toString() || "1",
            reception_rooms: propertyData.reception_rooms?.toString() || "0",
            price: propertyData.price?.toString() || "",
            price_qualifier: propertyData.price_qualifier || "",
            rent_frequency: propertyData.rent_frequency || "monthly",
            status: propertyData.status || "available",
            available_date: propertyData.available_date || "",
            featured: propertyData.featured || false,
            region_id: propertyData.areas?.region_id?.toString() || "",
            area_id: propertyData.area_id?.toString() || "",
            address: propertyData.address || "",
            postcode: propertyData.postcode || "",
            latitude: propertyData.latitude?.toString() || "",
            longitude: propertyData.longitude?.toString() || "",
            features: propertyData.property_features?.map((f: any) => f.feature_name) || [],
            furnished_status: propertyData.property_details?.furnished_status || "",
            deposit_amount: propertyData.property_details?.deposit_amount?.toString() || "",
            pets_policy: propertyData.property_details?.pets_policy || "",
            smoking_policy: propertyData.property_details?.smoking_policy || "",
            minimum_tenancy: propertyData.property_details?.minimum_tenancy?.toString() || "",
            maximum_tenancy: propertyData.property_details?.maximum_tenancy?.toString() || "",
            tenure: propertyData.property_details?.tenure || "",
            lease_remaining: propertyData.property_details?.lease_remaining?.toString() || "",
            service_charge: propertyData.property_details?.service_charge?.toString() || "",
            ground_rent: propertyData.property_details?.ground_rent?.toString() || "",
            epc_rating: propertyData.property_details?.epc_rating || "",
            council_tax_band: propertyData.property_details?.council_tax_band || "",
            year_built: propertyData.property_details?.year_built?.toString() || "",
            construction_type: (propertyData.property_details as any)?.construction_type || "",
            heating_type: (propertyData.property_details as any)?.heating_type || "",
            parking: (propertyData.property_details as any)?.parking || "",
            garden: (propertyData.property_details as any)?.garden || "",
            meta_title: propertyData.meta_title || "",
            meta_description: propertyData.meta_description || "",
            keywords: propertyData.keywords || [],
          })

          setImages(propertyData.property_images?.sort((a, b) => a.display_order - b.display_order) || [])
        } else {
            if (categoriesData.length > 0) {
                setFormData(prev => ({...prev, category_id: categoriesData[0].id.toString()}))
            }
            if (regionsData.length > 0) {
                setFormData(prev => ({...prev, region_id: regionsData[0].id.toString()}))
            }
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

  useEffect(() => {
    const loadPropertyTypes = async () => {
      if (!formData.category_id) {
        setPropertyTypes([])
        return
      }
      try {
        const types = await fetchPropertyTypesByCategory(Number(formData.category_id))
        setPropertyTypes(types)
        
        const currentTypeIsValid = types.some((t) => t.id === Number(formData.property_type_id));
        if (mode === 'create' || !currentTypeIsValid) {
          if (types.length > 0) {
            setFormData(prev => ({ ...prev, property_type_id: types[0].id.toString() }));
          } else {
            setFormData(prev => ({ ...prev, property_type_id: "" }));
          }
        }
      } catch (err) {
        console.error("Error loading property types:", err)
      }
    }
    loadPropertyTypes()
  }, [formData.category_id, mode])

  useEffect(() => {
    const loadAreas = async () => {
      if (!formData.region_id) {
        setAreas([])
        return
      }
      try {
        const areasData = await fetchAreasByRegion(Number(formData.region_id))
        setAreas(areasData)
        if (formData.area_id && !areasData.some((a) => a.id === Number(formData.area_id))) {
          setFormData((prev) => ({ ...prev, area_id: "" }))
        }
      } catch (err) {
        console.error("Error loading areas:", err)
      }
    }
    loadAreas()
  }, [formData.region_id, formData.area_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFeatureChange = (features: string[]) => setFormData((prev) => ({ ...prev, features }))
  const handleKeywordsChange = (keywords: string[]) => setFormData((prev) => ({ ...prev, keywords }))
  const handleImageChange = (newImages: (File | PropertyImage)[]) => setImages(newImages)
  const handleDocumentChange = (type: string, file: File | null) => setDocuments((prev) => ({ ...prev, [type]: file }))
  const handleRegionCreated = (region: Region) => {
    setRegions((prev) => [...prev, region])
    setFormData((prev) => ({ ...prev, region_id: region.id.toString() }))
    setShowRegionModal(false)
  }
  const handleAreaCreated = (area: Area) => {
    setAreas((prev) => [...prev, area])
    setFormData((prev) => ({ ...prev, area_id: area.id.toString() }))
    setShowAreaModal(false)
  }
  const handlePropertyTypeCreated = (propertyType: PropertyType) => {
    setPropertyTypes((prev) => [...prev, propertyType])
    setFormData((prev) => ({ ...prev, property_type_id: propertyType.id.toString() }))
    setShowPropertyTypeModal(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const formPayload = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formPayload.append(key, JSON.stringify(value))
      } else {
        formPayload.append(key, String(value))
      }
    })

    const newFiles = images.filter(img => img instanceof File) as File[];
    newFiles.forEach((file, index) => {
        formPayload.append(`image_${index}`, file);
    });

    const imageOrder = images.map(img => {
      if (img instanceof File) {
        return { name: img.name, is_featured: false }; // Placeholder for new files
      }
      return { id: img.id, is_featured: img.is_featured };
    });
    formPayload.append('image_order', JSON.stringify(imageOrder));

    Object.entries(documents).forEach(([type, file]) => {
      if (file) {
        formPayload.append(type, file)
      }
    })

    try {
      let result
      if (mode === "create") {
        result = await createProperty(formPayload)
      } else if (propertyId) {
        formPayload.append("property_id", propertyId.toString())
        result = await updateProperty(formPayload)
      } else {
        throw new Error("Property ID is missing for update.")
      }

      if (result.success) {
        setSuccess(`Property ${mode === "create" ? "created" : "updated"} successfully! Redirecting...`)
        setTimeout(() => {
          router.push("/admin/properties")
          router.refresh()
        }, 2000)
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} property:`, err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
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
            <TabsTrigger value="features">Features &amp; SEO</TabsTrigger>
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
            <FeaturesForm
              features={formData.features}
              onFeaturesChange={handleFeatureChange}
              keywords={formData.keywords}
              onKeywordsChange={handleKeywordsChange}
              formData={formData}
              onChange={handleChange}
            />
          </TabsContent>
          <TabsContent value="images">
            <ImagesForm
              images={images}
              onImagesChange={handleImageChange}
            />
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

      <CreateRegionModal
        isOpen={showRegionModal}
        onClose={() => setShowRegionModal(false)}
        onRegionSaved={handleRegionCreated}
      />
      <CreateAreaModal
        isOpen={showAreaModal}
        onClose={() => setShowAreaModal(false)}
        regions={regions}
        existingArea={null}
        onAreaSaved={handleAreaCreated}
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
