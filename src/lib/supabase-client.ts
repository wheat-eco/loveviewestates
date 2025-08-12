
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

export interface ViewingRequest {
  id: number
  property_id: number
  name: string
  email: string
  phone?: string
  message?: string
  preferred_date?: string
  alternative_date?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  created_at: string
  updated_at: string
  admin_notes?: string
  properties?: Property
}

export interface ValuationRequest {
  id: number
  name: string
  email: string
  phone?: string
  address: string
  postcode: string
  property_type_id: number
  bedrooms: number
  preferred_contact_method: "email" | "phone"
  message?: string
  status: "pending" | "scheduled" | "completed" | "cancelled"
  estimated_value?: number
  admin_notes?: string
  created_at: string
  updated_at: string
  property_types?: PropertyType
}

export interface ContactInquiry {
  id: number
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: "new" | "in_progress" | "resolved" | "closed"
  admin_notes?: string
  property_id?: number
  created_at: string
  updated_at: string
  properties?: Property
}

interface RequestFilters {
  status?: string;
  searchTerm?: string;
  limit?: number;
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

export const fetchAllAreas = async (): Promise<Area[]> => {
  const { data, error } = await supabase
    .from("areas")
    .select(`
        *,
        regions (
          id,
          name
        )
      `)
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
    areas!inner(
      *,
      regions!inner(*)
    ),
    property_categories!inner(*),
    property_types!inner(*),
    property_images(*)
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

const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const createRegion = async (name: string, description?: string): Promise<Region> => {
  const { data, error } = await supabase.from("regions").insert({ name: name.trim(), slug: generateSlug(name), description: description?.trim() || null }).select().single();
  if (error) throw error;
  return data;
}

export const updateRegion = async (id: number, name: string, description?: string): Promise<Region> => {
  const { data, error } = await supabase.from("regions").update({ name: name.trim(), slug: generateSlug(name), description: description?.trim() || null, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export const deleteRegion = async (id: number): Promise<void> => {
  const { data: areas, error: areasError } = await supabase.from("areas").select("id").eq("region_id", id);
  if (areasError) throw areasError;

  const areaIds = areas.map(a => a.id);
  if (areaIds.length > 0) {
    const { count, error: propertiesError } = await supabase.from("properties").select("id", { count: "exact", head: true }).in("area_id", areaIds);
    if (propertiesError) throw propertiesError;
    if (count && count > 0) throw new Error("Cannot delete region with existing properties.");
  }

  const { error } = await supabase.from("regions").delete().eq("id", id);
  if (error) throw error;
}

export const createArea = async (name: string, regionId: number, description?: string): Promise<Area> => {
  const { data, error } = await supabase.from("areas").insert({ name: name.trim(), slug: generateSlug(name), region_id: regionId, description: description?.trim() || null }).select(`*, regions(*)`).single();
  if (error) throw error;
  return data;
}

export const updateArea = async (id: number, name: string, regionId: number, description?: string): Promise<Area> => {
  const { data, error } = await supabase.from("areas").update({ name: name.trim(), slug: generateSlug(name), region_id: regionId, description: description?.trim() || null, updated_at: new Date().toISOString() }).eq("id", id).select(`*, regions(*)`).single();
  if (error) throw error;
  return data;
}

export const deleteArea = async (id: number): Promise<void> => {
  const { count, error: propertiesError } = await supabase.from("properties").select("id", { count: "exact", head: true }).eq("area_id", id);
  if (propertiesError) throw propertiesError;
  if (count && count > 0) throw new Error("Cannot delete area with existing properties.");
  
  const { error } = await supabase.from("areas").delete().eq("id", id);
  if (error) throw error;
}

// === Request Management Functions ===

export async function fetchViewingRequests(filters: RequestFilters): Promise<{ data: ViewingRequest[]; count: number }> {
  let query = supabase.from("viewing_requests").select(`*, properties (id, title, address, postcode, price)`, { count: "exact" });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.searchTerm) query = query.or(`name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`);

  query = query.order("created_at", { ascending: false }).limit(filters.limit || 100);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

export async function fetchValuationRequests(filters: RequestFilters): Promise<{ data: ValuationRequest[]; count: number }> {
  let query = supabase.from("valuation_requests").select(`*, property_types(display_name)`, { count: "exact" });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.searchTerm) query = query.or(`name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,address.ilike.%${filters.searchTerm}%`);
  
  query = query.order("created_at", { ascending: false }).limit(filters.limit || 100);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

export async function fetchContactInquiries(filters: RequestFilters): Promise<{ data: ContactInquiry[]; count: number }> {
  let query = supabase.from("contact_messages").select(`*, properties (id, title)`, { count: "exact" });
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.searchTerm) query = query.or(`name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,subject.ilike.%${filters.searchTerm}%`);
  
  query = query.order("created_at", { ascending: false }).limit(filters.limit || 100);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

export async function updateViewingRequestStatus(id: number, status: ViewingRequest["status"], admin_notes?: string): Promise<ViewingRequest> {
  const { data, error } = await supabase.from("viewing_requests").update({ status, admin_notes, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function updateValuationRequestStatus(id: number, status: ValuationRequest["status"], admin_notes?: string, estimated_value?: number): Promise<ValuationRequest> {
  const { data, error } = await supabase.from("valuation_requests").update({ status, admin_notes, estimated_value, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function updateContactInquiryStatus(id: number, status: ContactInquiry["status"], admin_notes?: string): Promise<ContactInquiry> {
  const { data, error } = await supabase.from("contact_messages").update({ status, admin_notes, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteViewingRequest(id: number): Promise<void> {
    const { error } = await supabase.from("viewing_requests").delete().eq("id", id);
    if (error) throw error;
}

export async function deleteValuationRequest(id: number): Promise<void> {
    const { error } = await supabase.from("valuation_requests").delete().eq("id", id);
    if (error) throw error;
}

export async function deleteContactInquiry(id: number): Promise<void> {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) throw error;
}
