import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import { MapPin, Bed, Bath, Home, Calendar } from "lucide-react"
import styles from "../for-sale-north-ayrshire/for-sale.module.css"

export const metadata = {
  title: "East Ayrshire Rental Properties | Love View Estate",
  description: "Browse our selection of rental properties in East Ayrshire.",
}

async function getEastAyrshireRentals() {
  const supabase = await createClient()

  // Get East Ayrshire region ID first
  const { data: region } = await supabase.from("regions").select("id").eq("name", "East Ayrshire").single()

  if (!region) {
    console.log("East Ayrshire region not found")
    return []
  }

  console.log("Found East Ayrshire region with ID:", region.id)

  // Fetch rental properties in East Ayrshire
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
      available_date,
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
    .eq("property_categories.name", "rent")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching East Ayrshire rentals:", error)
    return []
  }

  console.log(`Found ${properties?.length || 0} rental properties in East Ayrshire`)
  return properties || []
}

export default async function ToRentEastAyrshirePage() {
  const properties = await getEastAyrshireRentals()

  return (
    <section className={styles.rentalSection}>
      <div className={styles.rentalContainer}>
        <h1 className={styles.rentalHeading}>TO RENT EAST AYRSHIRE</h1>
        <p className={styles.rentalSubheading}>Discover our selection of rental properties in East Ayrshire.</p>

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
                      <MapPin size={16} className="mr-1 text-primary-gold" />
                      {property.address}
                    </p>

                    <div className={styles.propertyFeatures}>
                      <div className={styles.propertyFeature}>
                        <MapPin size={16} className="mr-1 text-primary-gold" /> {property.areas?.name}
                      </div>
                      <div className={styles.propertyFeature}>
                        <Bed size={16} className="mr-1 text-primary-gold" /> {property.bedrooms} Bedroom
                        {property.bedrooms !== 1 ? "s" : ""}
                      </div>
                      <div className={styles.propertyFeature}>
                        <Bath size={16} className="mr-1 text-primary-gold" /> {property.bathrooms} Bathroom
                        {property.bathrooms !== 1 ? "s" : ""}
                      </div>
                      {property.property_types?.display_name && (
                        <div className={styles.propertyFeature}>
                          <Home size={16} className="mr-1 text-primary-gold" /> {property.property_types.display_name}
                        </div>
                      )}
                      <div className={styles.propertyFeature}>
                        <MapPin size={16} className="mr-1 text-primary-gold" /> {property.postcode}
                      </div>
                      {property.available_date && (
                        <div className={styles.propertyFeature}>
                          <Calendar size={16} className="mr-1 text-primary-gold" />
                          {new Date(property.available_date).toLocaleDateString("en-GB")}
                        </div>
                      )}
                    </div>

                    <div className={styles.propertyPriceContainer}>
                      <div className={styles.propertyPrice}>
                        £{property.price.toLocaleString()}{" "}
                        <span className="text-sm font-normal text-gray-500">PCM</span>
                      </div>
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
                No properties currently available in East Ayrshire. Please check back soon or contact us for more
                information.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
