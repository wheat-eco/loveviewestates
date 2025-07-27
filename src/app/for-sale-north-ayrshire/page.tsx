import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import { MapPin, Bed, Bath, Home } from "lucide-react"
import styles from "./for-sale.module.css"

export const metadata = {
  title: "North Ayrshire Properties For Sale | Love View Estate",
  description: "Browse our selection of properties for sale in North Ayrshire.",
}

async function getNorthAyrshireProperties() {
  const supabase = await createClient()

  // Get North Ayrshire region ID first
  const { data: region } = await supabase.from("regions").select("id").eq("name", "North Ayrshire").single()

  if (!region) {
    console.log("North Ayrshire region not found")
    return []
  }

  console.log("Found North Ayrshire region with ID:", region.id)

  // Fetch properties for sale in North Ayrshire
  const { data: properties, error } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      slug,
      address,
      postcode,
      bedrooms,
      bathrooms,
      price,
      status,
      areas!inner (
        id,
        name,
        region_id
      ),
      property_categories!inner (
        name
      ),
      property_types (
        display_name
      ),
      property_images (
        id,
        image_url,
        is_featured,
        display_order
      )
    `)
    .eq("areas.region_id", region.id)
    .eq("property_categories.name", "sale")
    // .eq("status", "available") // <-- Remove or comment out this line
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching North Ayrshire properties:", error)
    return []
  }

  console.log(`Found ${properties?.length || 0} properties for sale in North Ayrshire`)
  return properties || []
}

export default async function ForSaleNorthAyrshirePage() {
  const properties = await getNorthAyrshireProperties()

  return (
    <section className={styles.rentalSection}>
      <div className={styles.rentalContainer}>
        <h1 className={styles.rentalHeading}>FOR SALE NORTH AYRSHIRE</h1>
        <p className={styles.rentalSubheading}>
          Please find below a selection of our properties for sale in North Ayrshire.
        </p>

        <div className={styles.propertiesList}>
          {properties.length > 0 ? (
            properties.map((property) => {
              // Find featured image or use first image with proper sorting
              const sortedImages = property.property_images?.sort((a, b) => a.display_order - b.display_order) || []
              const featuredImage = sortedImages.find((img) => img.is_featured) || sortedImages[0]

              const imageUrl = featuredImage?.image_url || "/placeholder.svg?height=400&width=600"

              return (
                <div key={property.id} className={styles.propertyItem}>
                  <div className={styles.propertyImageContainer}>
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={property.title}
                      width={600}
                      height={400}
                      className={styles.propertyImage}
                    />
                    {property.status && <div className={styles.propertyStatus}>{property.status}</div>}
                  </div>
                  <div className={styles.propertyDetails}>
                    <h2 className={styles.propertyTitle}>{property.title}</h2>
                    <p className={styles.propertyLocation}>
                      <MapPin size={16} />
                      {property.address}
                    </p>

                    <div className={styles.propertyFeatures}>
                      <div className={styles.propertyFeature}>
                        <MapPin size={16} /> {property.areas?.name}
                      </div>
                      <div className={styles.propertyFeature}>
                        <Bed size={16} /> {property.bedrooms} Bedroom
                        {property.bedrooms !== 1 ? "s" : ""}
                      </div>
                      <div className={styles.propertyFeature}>
                        <Bath size={16} /> {property.bathrooms} Bathroom
                        {property.bathrooms !== 1 ? "s" : ""}
                      </div>
                      {property.property_types?.display_name && (
                        <div className={styles.propertyFeature}>
                          <Home size={16} /> {property.property_types.display_name}
                        </div>
                      )}
                      <div className={styles.propertyFeature}>
                        <MapPin size={16} /> {property.postcode}
                      </div>
                    </div>

                    <div className={styles.propertyPriceContainer}>
                      <div className={styles.propertyPrice}>£{property.price.toLocaleString()}</div>
                      <Link href={`/property/${property.slug}`} className={styles.propertyButton}>
                        More Info
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className={styles.noProperties}>
              <p>
                No properties currently for sale in North Ayrshire. Please check back soon or contact us for more
                information.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
