import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import PropertyDetailPageClient from "./PropertyDetailPageClient"

export async function generateMetadata(props: { params: { slug: string } }) {
  const { slug } = props.params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from("properties")
    .select("title, description, property_category")
    .eq("slug", slug)
    .single()

  if (!property) {
    return {
      title: "Property | Love View Estate",
      description: "View details of this property.",
    }
  }

  return {
    title: `${property.title} | Love View Estate`,
    description: property.description || `View details of ${property.title}.`,
  }
}

// Define explicit types for the Supabase response
type RegionType = {
  id: string
  name: string
  slug: string
}

type AreaType = {
  id: string
  name: string
  regions: RegionType | RegionType[] | null
}

type RawPropertyType = {
  id: string
  title: string
  slug: string
  description: string
  address: string
  postcode: string
  property_type: string
  property_category: string
  bedrooms: number
  bathrooms: number
  price: number
  available_date: string
  status: string
  areas: AreaType[]
  property_images: {
    id: string
    image_url: string
    caption: string
    is_featured: boolean
    display_order: number
  }[]
  property_features: {
    id: string
    feature_name: string
  }[]
  property_details: {
    furnished_status: string
    epc_rating: string
    council_tax_band: string
    deposit_amount: number
    pets_policy: string
    smoking_policy: string
  }[]
}

// Define the final Property type that will be passed to the client
type Property = {
  id: string
  title: string
  slug: string
  description: string
  address: string
  postcode: string
  property_type: string
  property_category: string
  bedrooms: number
  bathrooms: number
  price: number
  available_date: string
  status: string
  areas: {
    id: string
    name: string
    region: {
      id: string
      name: string
      slug: string
    }
  }[]
  property_images: {
    id: string
    image_url: string
    caption: string
    is_featured: boolean
    display_order: number
  }[]
  property_features: {
    id: string
    feature_name: string
  }[]
  property_details: {
    furnished_status: string
    epc_rating: string
    council_tax_band: string
    deposit_amount: number
    pets_policy: string
    smoking_policy: string
  }
  property_documents: {
    id: string
    document_url: string
    document_name: string
    document_type?: string
    property_id?: string
    created_at?: string
  }[]
}

async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = await createClient()

  // Fetch raw property with Supabase joins
  const { data: raw, error } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      slug,
      description,
      address,
      postcode,
      property_type,
      property_category,
      bedrooms,
      bathrooms,
      price,
      available_date,
      status,
      areas (
        id,
        name,
        regions (
          id,
          name,
          slug
        )
      ),
      property_images (
        id,
        image_url,
        caption,
        is_featured,
        display_order
      ),
      property_features (
        id,
        feature_name
      ),
      property_details (
        furnished_status,
        epc_rating,
        council_tax_band,
        deposit_amount,
        pets_policy,
        smoking_policy
      )
    `)
    .eq("slug", slug)
    .single()

  if (error || !raw) {
    console.error("Error fetching property:", error)
    return null
  }

  // Fetch property documents separately
  const { data: documents } = await supabase.from("property_documents").select("*").eq("property_id", raw.id)

  // Cast raw to the explicit type
  const typedRaw = raw as unknown as RawPropertyType

  // Map raw data into the typed `Property` shape
  const property: Property = {
    id: typedRaw.id,
    title: typedRaw.title,
    slug: typedRaw.slug,
    description: typedRaw.description,
    address: typedRaw.address,
    postcode: typedRaw.postcode,
    property_type: typedRaw.property_type,
    property_category: typedRaw.property_category,
    bedrooms: typedRaw.bedrooms,
    bathrooms: typedRaw.bathrooms,
    price: typedRaw.price,
    available_date: typedRaw.available_date,
    status: typedRaw.status,

    // Safely map areas and regions
    areas: typedRaw.areas.map((area) => {
      let regionData: RegionType = { id: "", name: "", slug: "" }

      // Handle different possible shapes of regions data
      if (area.regions) {
        if (Array.isArray(area.regions) && area.regions.length > 0) {
          // If regions is an array, take the first item
          regionData = {
            id: area.regions[0]?.id || "",
            name: area.regions[0]?.name || "",
            slug: area.regions[0]?.slug || "",
          }
        } else if (typeof area.regions === "object") {
          // If regions is an object, use it directly
          const regions = area.regions as RegionType
          regionData = {
            id: regions.id || "",
            name: regions.name || "",
            slug: regions.slug || "",
          }
        }
      }

      return {
        id: area.id,
        name: area.name,
        region: regionData,
      }
    }),

    property_images: typedRaw.property_images,
    property_features: typedRaw.property_features,
    property_details:
      Array.isArray(typedRaw.property_details) && typedRaw.property_details.length > 0
        ? typedRaw.property_details[0]
        : {
            furnished_status: "",
            epc_rating: "",
            council_tax_band: "",
            deposit_amount: 0,
            pets_policy: "",
            smoking_policy: "",
          },
    property_documents: documents || [],
  }

  return property
}

export default async function PropertyDetailPage(props: { params: { slug: string } }) {
  const { slug } = props.params
  const property = await getPropertyBySlug(slug)

  if (!property) notFound()

  return <PropertyDetailPageClient property={property} />
}
