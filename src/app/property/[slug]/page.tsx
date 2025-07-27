import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import PropertyDetailPageClient from "./PropertyDetailPageClient"
import type { Metadata } from 'next';

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug
  const supabase = await createClient()

  const { data: property } = await supabase
    .from("properties")
    .select(`
        title, 
        description,
        property_images(image_url, is_featured)
    `)
    .eq("slug", slug)
    .single()

  if (!property) {
    return {
      title: "Property Not Found",
      description: "The property you are looking for could not be found.",
    }
  }
  
  const featuredImage = property.property_images?.find(img => img.is_featured)?.image_url || property.property_images?.[0]?.image_url

  return {
    title: property.title,
    description: property.description?.substring(0, 160) || `View details for ${property.title}.`,
    openGraph: {
        title: property.title,
        description: property.description?.substring(0, 160) || `View details for ${property.title}.`,
        url: `/property/${slug}`,
        images: featuredImage ? [
            {
                url: featuredImage,
                width: 1200,
                height: 630,
                alt: property.title,
            }
        ] : [],
    }
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
      property_types (
        display_name
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
      ),
      property_categories (
        name
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

export default async function PropertyDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const property = await getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  // Extract area and region information
  const area = property.areas ? property.areas.name : null
  const region = property.areas?.regions ? property.areas.regions.name : null

  return <PropertyDetailPageClient property={property} area={area} region={region} />
}
