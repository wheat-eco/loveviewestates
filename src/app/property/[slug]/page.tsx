import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Database } from "@/types/supabase"
import PropertyDetailPageClient from "./PropertyDetailPageClient"


export async function generateMetadata(
  props: { params: { slug: string } }
) {
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

async function getPropertyBySlug(
  slug: string
): Promise<Property | null> {
  const supabase = await createClient()

  // Fetch raw property with Supabase joins (all as arrays)
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
  const { data: documents } = await supabase
    .from("property_documents")
    .select("*")
    .eq("property_id", raw.id)

  // Map raw data into the typed `Property` shape
  const property: Property = {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    address: raw.address,
    postcode: raw.postcode,
    property_type: raw.property_type,
    property_category: raw.property_category,
    bedrooms: raw.bedrooms,
    bathrooms: raw.bathrooms,
    price: raw.price,
    available_date: raw.available_date,
    status: raw.status,

    areas: raw.areas.map(area => ({
      id: area.id,
      name: area.name,
      region: {
        id:   area.regions?.[0]?.id   || area.region_id!,
        name: area.regions?.[0]?.name || "",
        slug: area.regions?.[0]?.slug || "",
      }
    })),

    property_images: raw.property_images,
    property_features: raw.property_features,
    property_details: raw.property_details,
    property_documents: documents || [],
  }

  return property
}

export default async function PropertyDetailPage(
  props: { params: { slug: string } }
) {
  const { slug } = props.params
  const property = await getPropertyBySlug(slug)

  if (!property) notFound()

  return <PropertyDetailPageClient property={property} />
}
