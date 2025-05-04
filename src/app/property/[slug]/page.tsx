import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import PropertyDetailPageClient from "./PropertyDetailPageClient"

export async function generateMetadata(props: { params: { slug: string } }) {
  // Properly await params by using props
  const { params } = props
  const slug = params.slug

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

async function getPropertyBySlug(slug: string) {
  const supabase = await createClient()

  const { data: property, error } = await supabase
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

  if (error || !property) {
    console.error("Error fetching property:", error)
    return null
  }

  // Fetch property documents separately
  const { data: documents } = await supabase.from("property_documents").select("*").eq("property_id", property.id)

  // Add documents to property object
  return {
    ...property,
    property_documents: documents || [],
  }
}

export default async function PropertyDetailPage(props: { params: { slug: string } }) {
  // Properly await params by using props
  const { params } = props
  const slug = params.slug

  const property = await getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  return <PropertyDetailPageClient property={property} />
}
