"use client"

import { useState, useEffect, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import styles from "../admin-properties.module.css"

export default function AddPropertyPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [regions, setRegions] = useState<{ id: string; name: string }[]>([])
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [epcDocument, setEpcDocument] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    property_category: "",
    address: "",
    postcode: "",
    region_id: "",
    area_id: "",
    bedrooms: "",
    bathrooms: "",
    property_type: "",
    price: "",
    status: "",
    available_date: "",
    description: "",
    furnished_status: "",
    epc_rating: "",
    council_tax_band: "",
    deposit_amount: "",
    pets_policy: "",
    smoking_policy: "",
    features: "",
  })

  // Fetch regions on component mount
  useEffect(() => {
    async function fetchRegions() {
      const { data, error } = await supabase.from("regions").select("id, name").order("name")

      if (error) {
        console.error("Error fetching regions:", error)
      } else {
        setRegions(data)
      }
    }

    fetchRegions()
  }, [supabase])

  // Fetch areas when region changes
  useEffect(() => {
    async function fetchAreas() {
      if (!formData.region_id) {
        setAreas([])
        return
      }

      const { data, error } = await supabase
        .from("areas")
        .select("id, name")
        .eq("region_id", formData.region_id)
        .order("name")

      if (error) {
        console.error("Error fetching areas:", error)
      } else {
        setAreas(data)
        // Reset area selection when region changes
        setFormData((prev) => ({ ...prev, area_id: "" }))
      }
    }

    fetchAreas()
  }, [formData.region_id, supabase])

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setImageFiles(files)

    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file))
    setImagePreviewUrls(previewUrls)
  }

  const handleEpcDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      setEpcDocument(files && files[0] ? files[0] : null);
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      // Basic validation
      if (!formData.title || !formData.description || !formData.price) {
        setError("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      // Generate slug from title
      let slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

      // Check if slug exists
      const { data: existingSlug } = await supabase.from("properties").select("id").eq("slug", slug).single()

      if (existingSlug) {
        // Append random string to make slug unique
        slug += `-${Math.random().toString(36).substring(2, 8)}`
      }

      // Insert property
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert({
          title: formData.title,
          slug,
          description: formData.description,
          area_id: formData.area_id,
          address: formData.address,
          postcode: formData.postcode,
          property_category: formData.property_category,
          property_type: formData.property_type,
          bedrooms: Number.parseInt(formData.bedrooms),
          bathrooms: Number.parseInt(formData.bathrooms),
          price: Number.parseFloat(formData.price),
          available_date: formData.available_date || null,
          status: formData.status,
        })
        .select()

      if (propertyError) {
        throw new Error(`Error adding property: ${propertyError.message}`)
      }

      const propertyId = property[0].id

      // Insert property details if any are provided
      const hasAdditionalDetails =
        formData.furnished_status ||
        formData.epc_rating ||
        formData.council_tax_band ||
        formData.deposit_amount ||
        formData.pets_policy ||
        formData.smoking_policy

      if (hasAdditionalDetails) {
        const { error: detailsError } = await supabase.from("property_details").insert({
          property_id: propertyId,
          furnished_status: formData.furnished_status || null,
          epc_rating: formData.epc_rating || null,
          council_tax_band: formData.council_tax_band || null,
          deposit_amount: formData.deposit_amount ? Number.parseFloat(formData.deposit_amount) : null,
          pets_policy: formData.pets_policy || null,
          smoking_policy: formData.smoking_policy || null,
        })

        if (detailsError) {
          console.error("Error adding property details:", detailsError)
        }
      }

      // Insert property features
      if (formData.features) {
        const features = formData.features.split("\n").filter((feature) => feature.trim())

        for (const feature of features) {
          const { error: featureError } = await supabase.from("property_features").insert({
            property_id: propertyId,
            feature_name: feature.trim(),
          })

          if (featureError) {
            console.error("Error adding feature:", featureError)
          }
        }
      }

      // Upload images
      if (imageFiles.length > 0) {
        let featuredImageSet = false

        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i]
          const fileExt = file.name.split(".").pop()
          const fileName = `${propertyId}/${Date.now()}.${fileExt}`
          const filePath = `property-images/${fileName}`

          // Upload image to storage
          const { error: uploadError } = await supabase.storage.from("properties").upload(filePath, file)

          if (uploadError) {
            console.error("Error uploading image:", uploadError)
            continue
          }

          // Get public URL
          const { data: publicUrlData } = supabase.storage.from("properties").getPublicUrl(filePath)

          // Set first image as featured if none is set
          const isFeatured = !featuredImageSet
          if (isFeatured) {
            featuredImageSet = true
          }

          // Insert image info into database
          const { error: imageError } = await supabase.from("property_images").insert({
            property_id: propertyId,
            image_url: publicUrlData.publicUrl,
            is_featured: isFeatured,
            display_order: i,
          })

          if (imageError) {
            console.error("Error adding image record:", imageError)
          }
        }
      }

      // Upload EPC document
      if (epcDocument) {
        const fileExt = epcDocument.name.split(".").pop()
        const fileName = `${propertyId}/epc-${Date.now()}.${fileExt}`
        const filePath = `property-documents/${fileName}`

        // Upload document to storage
        const { error: uploadError } = await supabase.storage.from("properties").upload(filePath, epcDocument)

        if (uploadError) {
          console.error("Error uploading EPC document:", uploadError)
        } else {
          // Get public URL
          const { data: publicUrlData } = supabase.storage.from("properties").getPublicUrl(filePath)

          // Insert document info into database
          const { error: docError } = await supabase.from("property_documents").insert({
            property_id: propertyId,
            document_name: "Energy Performance Certificate",
            document_url: publicUrlData.publicUrl,
            document_type: "EPC",
          })

          if (docError) {
            console.error("Error adding document record:", docError)
          }
        }
      }

      setSuccess("Property added successfully!")

      // Reset form after successful submission
      setFormData({
        title: "",
        property_category: "",
        address: "",
        postcode: "",
        region_id: "",
        area_id: "",
        bedrooms: "",
        bathrooms: "",
        property_type: "",
        price: "",
        status: "",
        available_date: "",
        description: "",
        furnished_status: "",
        epc_rating: "",
        council_tax_band: "",
        deposit_amount: "",
        pets_policy: "",
        smoking_policy: "",
        features: "",
      })
      setImageFiles([])
      setImagePreviewUrls([])
      setEpcDocument(null)

      // Redirect to properties list after a delay
      setTimeout(() => {
        router.push("/admin/properties")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout title="Add New Property">
      {success && <div className={styles.alertSuccess}>{success}</div>}
      {error && <div className={styles.alertDanger}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          <h2>Property Details</h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="title">
                Property Title <span className={styles.required}>*</span>
              </label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="property_category">
                Property Category <span className={styles.required}>*</span>
              </label>
              <select
                id="property_category"
                name="property_category"
                value={formData.property_category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="address">
                Address <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="postcode">
                Postcode <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="region_id">
                Region <span className={styles.required}>*</span>
              </label>
              <select id="region_id" name="region_id" value={formData.region_id} onChange={handleChange} required>
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="area_id">
                Area <span className={styles.required}>*</span>
              </label>
              <select
                id="area_id"
                name="area_id"
                value={formData.area_id}
                onChange={handleChange}
                required
                disabled={!formData.region_id}
              >
                <option value="">Select Region First</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="bedrooms">
                Bedrooms <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                min="0"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bathrooms">
                Bathrooms <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                min="0"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="property_type">
                Property Type <span className={styles.required}>*</span>
              </label>
              <select
                id="property_type"
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Terraced">Terraced</option>
                <option value="Semi-Detached">Semi-Detached</option>
                <option value="Detached">Detached</option>
                <option value="Bungalow">Bungalow</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price">
                Price <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status">
                Status <span className={styles.required}>*</span>
              </label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="LET AGREED">Let Agreed</option>
                <option value="FOR SALE">For Sale</option>
                <option value="UNDER OFFER">Under Offer</option>
                <option value="SOLD STC">Sold STC</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="available_date">Available Date</label>
              <input
                type="date"
                id="available_date"
                name="available_date"
                value={formData.available_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Additional Property Details</h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="furnished_status">Furnished Status</label>
              <select
                id="furnished_status"
                name="furnished_status"
                value={formData.furnished_status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="Furnished">Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Part Furnished">Part Furnished</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="epc_rating">EPC Rating</label>
              <select id="epc_rating" name="epc_rating" value={formData.epc_rating} onChange={handleChange}>
                <option value="">Select Rating</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="council_tax_band">Council Tax Band</label>
              <select
                id="council_tax_band"
                name="council_tax_band"
                value={formData.council_tax_band}
                onChange={handleChange}
              >
                <option value="">Select Band</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="deposit_amount">Deposit Amount</label>
              <input
                type="number"
                id="deposit_amount"
                name="deposit_amount"
                min="0"
                step="0.01"
                value={formData.deposit_amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="pets_policy">Pets Policy</label>
              <select id="pets_policy" name="pets_policy" value={formData.pets_policy} onChange={handleChange}>
                <option value="">Select Policy</option>
                <option value="Allowed">Allowed</option>
                <option value="Not Allowed">Not Allowed</option>
                <option value="Considered">Considered</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="smoking_policy">Smoking Policy</label>
              <select id="smoking_policy" name="smoking_policy" value={formData.smoking_policy} onChange={handleChange}>
                <option value="">Select Policy</option>
                <option value="Allowed">Allowed</option>
                <option value="Not Allowed">Not Allowed</option>
                <option value="Outside Only">Outside Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Property Features</h2>

          <div className={styles.formGroup}>
            <label htmlFor="features">Features (One per line)</label>
            <textarea
              id="features"
              name="features"
              placeholder="Gas Central Heating&#10;Double Glazing&#10;Private Garden"
              value={formData.features}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Property Images</h2>

          <div className={styles.formGroup}>
            <label htmlFor="images">Upload Images (First image will be featured)</label>
            <input type="file" id="images" name="images" accept="image/*" multiple onChange={handleImageChange} />
            <p className={styles.helpText}>
              You can select multiple images at once. The first image will be used as the featured image.
            </p>

            {imagePreviewUrls.length > 0 && (
              <div className={styles.imagePreviewContainer}>
                {imagePreviewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className={styles.imagePreview}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2>Property Documents</h2>

          <div className={styles.formGroup}>
            <label htmlFor="epc_document">EPC Document (PDF)</label>
            <input type="file" id="epc_document" name="epc_document" accept=".pdf" onChange={handleEpcDocumentChange} />
          </div>
        </div>

        <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
          {isSubmitting ? "Adding Property..." : "Add Property"}
        </button>
      </form>
    </AdminLayout>
  )
}
