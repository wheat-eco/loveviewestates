import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import { Bed, Bath, Home, MapPin, Calendar } from "lucide-react"
import styles from "./available-properties.module.css"

export const metadata = {
  title: "Available Properties | Love View Estate",
  description: "Browse our current selection of available properties across Ayrshire",
}

async function getAvailableProperties() {
  const supabase = await createClient()

  // Get all available properties (both for sale and rent) using the correct relationships
  const { data: properties, error } = await supabase
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
      reception_rooms,
      price,
      available_date,
      status,
      featured,
      areas (
        id,
        name,
        regions (
          id,
          name
        )
      ),
      property_categories (
        id,
        name,
        display_name
      ),
      property_types (
        id,
        name,
        display_name
      ),
      property_images (
        id,
        image_url,
        is_featured,
        display_order
      )
    `)
    .eq("status", "available")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching properties:", error)
    return []
  }

  return properties || []
}

export default async function AvailablePropertiesPage() {
  const properties = await getAvailableProperties()

  return (
    <section className={styles.propertiesSection}>
      <div className={styles.propertiesContainer}>
        <h1 className={styles.propertiesHeading}>AVAILABLE PROPERTIES</h1>
        <p className={styles.propertiesSubheading}>
          Browse our current selection of available properties across Ayrshire
        </p>

        {/* Property Listings */}
        <div className={styles.propertiesList}>
          {properties.length > 0 ? (
            properties.map((property) => {
              // Find featured image or use first image with proper sorting
              const sortedImages = property.property_images?.sort((a, b) => a.display_order - b.display_order) || []
              const featuredImage = sortedImages.find((img) => img.is_featured) || sortedImages[0]

              const imageUrl = featuredImage?.image_url || "/placeholder.svg?height=400&width=600"

              // Get area and region information
              const area = property.areas ? property.areas.name : null
              const region = property.areas?.regions ? property.areas.regions.name : null

              // Get category and type information
              const category = property.property_categories?.name
              const propertyType = property.property_types?.display_name

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
                    <div className={styles.propertyCategory}>{category === "rent" ? "TO RENT" : "FOR SALE"}</div>
                  </div>
                  <div className={styles.propertyDetails}>
                    <h2 className={styles.propertyTitle}>{property.title}</h2>
                    <p className={styles.propertyLocation}>
                      <MapPin size={16} className={styles.iconGold} />
                      {property.address} {region ? `(${region})` : ""}
                    </p>

                    <div className={styles.propertyFeatures}>
                      {area && (
                        <div className={styles.propertyFeature}>
                          <MapPin size={16} className={styles.iconGold} /> {area}
                        </div>
                      )}
                      <div className={styles.propertyFeature}>
                        <Bed size={16} className={styles.iconGold} /> {property.bedrooms} Bedroom
                        {property.bedrooms !== 1 ? "s" : ""}
                      </div>
                      <div className={styles.propertyFeature}>
                        <Bath size={16} className={styles.iconGold} /> {property.bathrooms} Bathroom
                        {property.bathrooms !== 1 ? "s" : ""}
                      </div>
                      {propertyType && (
                        <div className={styles.propertyFeature}>
                          <Home size={16} className={styles.iconGold} /> {propertyType}
                        </div>
                      )}
                      <div className={styles.propertyFeature}>
                        <MapPin size={16} className={styles.iconGold} /> {property.postcode}
                      </div>
                      {property.available_date && (
                        <div className={styles.propertyFeature}>
                          <Calendar size={16} className={styles.iconGold} />
                          {new Date(property.available_date).toLocaleDateString("en-GB")}
                        </div>
                      )}
                    </div>

                    <div className={styles.propertyPriceContainer}>
                      <div className={styles.propertyPrice}>
                        £{property.price.toLocaleString()}{" "}
                        {category === "rent" ? <span className={styles.pcm}>PCM</span> : null}
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
              <p>No properties available at the moment. Please check back soon.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className={styles.propertiesCta}>
          <p>Can't find what you're looking for? Contact our team for assistance.</p>
          <Link href="/contact" className={styles.btnPrimary}>
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
