import Link from "next/link"
import Image from "next/image"
import { createServerSupabaseClient } from "@/utils/supabase/serve"
import { Bed, Bath, Home, MapPin, Calendar } from "lucide-react"
import styles from "./available-properties.module.css"

export const metadata = {
  title: "Available Properties | Love View Estate",
  description: "Browse our current selection of available properties across Ayrshire",
}

async function getAvailableProperties() {
  const supabase = await createServerSupabaseClient()

  // Get all available properties (both for sale and rent)
  const { data: properties, error } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      slug,
      description,
      address,
      postcode,
      property_category,
      property_type,
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
          name
        )
      ),
      property_images (
        id,
        image_url,
        is_featured
      )
    `)
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
              // Find featured image or use first image
              const featuredImage =
                property.property_images?.find((img) => img.is_featured) ||
                (property.property_images?.length ? property.property_images[0] : null)

              const imageUrl = featuredImage?.image_url || "/img/property-placeholder.jpg"

              // Get area and region information
              const area = property.areas ? property.areas.name : null
              const region = property.areas?.regions ? property.areas.regions.name : null

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
                    <div className={styles.propertyCategory}>
                      {property.property_category === "rent" ? "TO RENT" : "FOR SALE"}
                    </div>
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
                      <div className={styles.propertyFeature}>
                        <Home size={16} className={styles.iconGold} /> {property.property_type}
                      </div>
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
                        £{property.price}{" "}
                        {property.property_category === "rent" ? <span className={styles.pcm}>PCM</span> : null}
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
