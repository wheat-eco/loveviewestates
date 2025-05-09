import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import PropertyDetailPageClient from "./PropertyDetailPageClient"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params before accessing its properties
  const resolvedParams = await params
  const slug = resolvedParams.slug

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
  const { data: documents, error: documentsError } = await supabase
    .from("property_documents")
    .select("*")
    .eq("property_id", property.id)

  if (documentsError) {
    console.error("Error fetching property documents:", documentsError)
  }

  // Add documents to property object
  return {
    ...property,
    property_documents: documents || [],
  }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params before accessing its properties
  const resolvedParams = await params
  const slug = resolvedParams.slug

  const property = await getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  // Extract area and region information
  const area = property.areas ? property.areas.name : null
  const region = property.areas?.regions ? property.areas.regions.name : null

  return <PropertyDetailPageClient property={property} area={area} region={region} />
}
