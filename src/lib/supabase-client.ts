import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const supabase = createClientComponentClient()

// Types for our database
export interface Region {
  id: number
  name: string
  slug: string
  description?: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Area {
  id: number
  name: string
  slug: string
  region_id: number
  description?: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  regions?: Region
}

export interface PropertyCategory {
  id: number
  name: string
  display_name: string
  slug: string
  description?: string
  required_fields: string[]
  optional_fields: string[]
  document_types: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PropertyType {
  id: number
  name: string
  display_name: string
  category_id: number
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Property {
  id: number
  title: string
  slug: string
  description?: string
  area_id: number
  address: string
  postcode: string
  latitude?: number
  longitude?: number
  category_id: number
  property_type_id: number
  bedrooms: number
  bathrooms: number
  reception_rooms?: number
  total_rooms?: number
  floor_area?: number
  price: number
  price_qualifier?: string
  rent_frequency?: string
  available_date?: string
  status: string
  featured: boolean
  priority: number
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  created_at: string
  updated_at: string
  published_at?: string
  areas?: Area
  property_categories?: PropertyCategory
  property_types?: PropertyType
  property_images?: PropertyImage[]
  property_details?: PropertyDetails
  property_features?: PropertyFeature[]
  property_documents?: PropertyDocument[]
}

export interface PropertyDetails {
  id: number
  property_id: number
  furnished_status?: string
  deposit_amount?: number
  pets_policy?: string
  smoking_policy?: string
  minimum_tenancy?: number
  maximum_tenancy?: number
  tenure?: string
  lease_remaining?: number
  service_charge?: number
  ground_rent?: number
  epc_rating?: string
  epc_score?: number
  council_tax_band?: string
  council_tax_amount?: number
  year_built?: number
  construction_type?: string
  heating_type?: string
  parking?: string
  garden?: string
  additional_details?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface PropertyImage {
  id: number
  property_id: number
  image_url: string
  thumbnail_url?: string
  alt_text?: string
  caption?: string
  image_type: string
  room_type?: string
  is_featured: boolean
  display_order: number
  file_size?: number
  dimensions?: string
  created_at: string
}

export interface PropertyFeature {
  id: number
  property_id: number
  feature_name: string
  feature_category?: string
  feature_value?: string
  display_order: number
  created_at: string
}

export interface PropertyDocument {
  id: number
  property_id: number
  document_name: string
  document_url: string
  document_type: string
  file_size?: number
  mime_type?: string
  is_public: boolean
  upload_date: string
  expiry_date?: string
  created_at: string
}

// New types for viewing and valuation requests
export interface ViewingRequest {
  id: number
  property_id: number
  name: string
  email: string
  phone?: string
  preferred_date: string
  preferred_time: string
  alternative_date?: string
  alternative_time?: string
  message?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  admin_notes?: string
  created_at: string
  updated_at: string
  properties?: Property
}

export interface ValuationRequest {
  id: number
  name: string
  email: string
  phone?: string
  property_address: string
  postcode: string
  property_type: string
  bedrooms?: number
  bathrooms?: number
  preferred_contact_method: "email" | "phone" | "either"
  preferred_date?: string
  preferred_time?: string
  message?: string
  status: "pending" | "scheduled" | "completed" | "cancelled"
  estimated_value?: number
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface ContactInquiry {
  id: number
  property_id?: number
  name: string
  email: string
  phone?: string
  inquiry_type: "general" | "property" | "viewing" | "valuation" | "other"
  subject?: string
  message: string
  status: "new" | "in_progress" | "resolved" | "closed"
  admin_notes?: string
  created_at: string
  updated_at: string
  properties?: Property
}

export interface Admin {
  id: string
  email: string
  full_name?: string
  role: "admin" | "super_admin"
  is_active: boolean
  permissions: {
    properties: boolean
    requests: boolean
    users: boolean
    settings: boolean
  }
  last_login?: string
  created_at: string
  updated_at: string
}

export const getAdminProfile = async (userId: string): Promise<Admin | null> => {
  const { data, error } = await supabase.from("admin").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching admin profile:", error)
    return null
  }

  return data
}

export const updateAdminLastLogin = async (userId: string) => {
  const { error } = await supabase
    .from("admin")
    .update({
      last_login: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("Error updating admin last login:", error)
  }
}

// Utility functions
export const fetchRegions = async (): Promise<Region[]> => {
  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) throw error
  return data || []
}

export const fetchAreasByRegion = async (regionId: number): Promise<Area[]> => {
  const { data, error } = await supabase
    .from("areas")
    .select(`
      *,
      regions (*)
    `)
    .eq("region_id", regionId)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) throw error
  return data || []
}

export const fetchPropertyCategories = async (): Promise<PropertyCategory[]> => {
  const { data, error } = await supabase
    .from("property_categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (error) throw error
  return data || []
}

export const fetchPropertyTypesByCategory = async (categoryId: number): Promise<PropertyType[]> => {
  const { data, error } = await supabase
    .from("property_types")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("display_name", { ascending: true })

  if (error) throw error
  return data || []
}

export const createPropertyType = async (
  name: string,
  displayName: string,
  categoryId: number,
  description?: string,
): Promise<PropertyType> => {
  const { data, error } = await supabase
    .from("property_types")
    .insert({
      name: name.toLowerCase().replace(/\s+/g, "_"),
      display_name: displayName.trim(),
      category_id: categoryId,
      description: description?.trim() || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const fetchPropertyById = async (id: number): Promise<Property> => {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      areas (
        *,
        regions (*)
      ),
      property_categories (*),
      property_types (*),
      property_images (*),
      property_details (*),
      property_features (*),
      property_documents (*)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export const fetchProperties = async (filters?: {
  category?: string
  region?: string
  area?: string
  min_price?: number
  max_price?: number
  bedrooms?: number
  property_type?: string
  status?: string
  featured?: boolean
  limit?: number
  offset?: number
}): Promise<{ data: Property[]; count: number }> => {
  let query = supabase.from("properties").select(
    `
    *,
    areas (
      *,
      regions (*)
    ),
    property_categories (*),
    property_types (*),
    property_images (*)
  `,
    { count: "exact" },
  )

  // Apply filters
  if (filters?.category) {
    query = query.eq("property_categories.name", filters.category)
  }

  if (filters?.region) {
    query = query.eq("areas.regions.slug", filters.region)
  }

  if (filters?.area) {
    query = query.eq("areas.slug", filters.area)
  }

  if (filters?.min_price) {
    query = query.gte("price", filters.min_price)
  }

  if (filters?.max_price) {
    query = query.lte("price", filters.max_price)
  }

  if (filters?.bedrooms) {
    query = query.eq("bedrooms", filters.bedrooms)
  }

  if (filters?.property_type) {
    query = query.eq("property_types.name", filters.property_type)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  } else {
    query = query.eq("status", "available")
  }

  if (filters?.featured !== undefined) {
    query = query.eq("featured", filters.featured)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  query = query.order("featured", { ascending: false }).order("created_at", { ascending: false })

  const { data, error, count } = await query

  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export const deleteProperty = async (id: number): Promise<void> => {
  const { error } = await supabase.from("properties").delete().eq("id", id)

  if (error) throw error
}

// Viewing request functions
export const fetchViewingRequests = async (filters?: {
  status?: string
  property_id?: number
  limit?: number
  offset?: number
}): Promise<{ data: ViewingRequest[]; count: number }> => {
  let query = supabase.from("viewing_requests").select(
    `
      *,
      properties (
        id,
        title,
        address,
        postcode,
        price,
        property_categories (display_name)
      )
    `,
    { count: "exact" },
  )

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.property_id) {
    query = query.eq("property_id", filters.property_id)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  query = query.order("created_at", { ascending: false })

  const { data, error, count } = await query

  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export const updateViewingRequestStatus = async (
  id: number,
  status: ViewingRequest["status"],
  adminNotes?: string,
): Promise<ViewingRequest> => {
  const { data, error } = await supabase
    .from("viewing_requests")
    .update({
      status,
      admin_notes: adminNotes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(`
      *,
      properties (
        id,
        title,
        address,
        postcode,
        price,
        property_categories (display_name)
      )
    `)
    .single()

  if (error) throw error
  return data
}

// Valuation request functions
export const fetchValuationRequests = async (filters?: {
  status?: string
  limit?: number
  offset?: number
}): Promise<{ data: ValuationRequest[]; count: number }> => {
  let query = supabase.from("valuation_requests").select("*", { count: "exact" })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  query = query.order("created_at", { ascending: false })

  const { data, error, count } = await query

  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export const updateValuationRequestStatus = async (
  id: number,
  status: ValuationRequest["status"],
  adminNotes?: string,
  estimatedValue?: number,
): Promise<ValuationRequest> => {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes
  }

  if (estimatedValue !== undefined) {
    updateData.estimated_value = estimatedValue
  }

  const { data, error } = await supabase.from("valuation_requests").update(updateData).eq("id", id).select("*").single()

  if (error) throw error
  return data
}

// Contact inquiry functions
export const fetchContactInquiries = async (filters?: {
  status?: string
  inquiry_type?: string
  limit?: number
  offset?: number
}): Promise<{ data: ContactInquiry[]; count: number }> => {
  let query = supabase.from("contact_inquiries").select(
    `
      *,
      properties (
        id,
        title,
        address,
        postcode
      )
    `,
    { count: "exact" },
  )

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.inquiry_type) {
    query = query.eq("inquiry_type", filters.inquiry_type)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  query = query.order("created_at", { ascending: false })

  const { data, error, count } = await query

  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export const updateContactInquiryStatus = async (
  id: number,
  status: ContactInquiry["status"],
  adminNotes?: string,
): Promise<ContactInquiry> => {
  const { data, error } = await supabase
    .from("contact_inquiries")
    .update({
      status,
      admin_notes: adminNotes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(`
      *,
      properties (
        id,
        title,
        address,
        postcode
      )
    `)
    .single()

  if (error) throw error
  return data
}

export const createRegion = async (name: string, description?: string): Promise<Region> => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const { data, error } = await supabase
    .from("regions")
    .insert({
      name: name.trim(),
      slug,
      description: description?.trim() || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const createArea = async (name: string, regionId: number, description?: string): Promise<Area> => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const { data, error } = await supabase
    .from("areas")
    .insert({
      name: name.trim(),
      slug,
      region_id: regionId,
      description: description?.trim() || null,
    })
    .select(`
      *,
      regions (*)
    `)
    .single()

  if (error) throw error
  return data
}

// Fixed upload functions with better error handling
export const uploadPropertyImage = async (file: File, propertyId: number): Promise<string> => {
  try {
    // Validate file
    if (!file) throw new Error("No file provided")
    if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)")

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed")
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase()
    const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `property-images/${fileName}`

    console.log("Uploading image:", { fileName, fileSize: file.size, fileType: file.type })

    const { data, error } = await supabase.storage.from("properties").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Storage upload error:", error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    const { data: urlData } = supabase.storage.from("properties").getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error("Image upload error:", error)
    throw error
  }
}

export const uploadPropertyDocument = async (file: File, propertyId: number, documentType: string): Promise<string> => {
  try {
    // Validate file
    if (!file) throw new Error("No file provided")
    if (file.size > 50 * 1024 * 1024) throw new Error("File too large (max 50MB)")

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only PDF and Word documents are allowed")
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase()
    const fileName = `${propertyId}/${documentType}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `property-documents/${fileName}`

    console.log("Uploading document:", { fileName, fileSize: file.size, fileType: file.type })

    const { data, error } = await supabase.storage.from("properties").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Storage upload error:", error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    const { data: urlData } = supabase.storage.from("properties").getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error("Document upload error:", error)
    throw error
  }
}
