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

  // Get East Ayrshire region ID
  const { data: region } = await supabase.from("regions").select("id").eq("name", "East Ayrshire").single()

  if (!region) {
    return []
  }

  // Fetch properties from database
  const { data: properties, error } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      slug,
      address,
      postcode,
      property_category,
      property_type,
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
      property_images (
        id,
        image_url,
        is_featured
      )
    `)
    .eq("areas.region_id", region.id)
    .eq("property_category", "rent")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching properties:", error)
    return []
  }

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
              // Find featured image or use first image
              const featuredImage =
                property.property_images?.find((img) => img.is_featured) ||
                (property.property_images?.length ? property.property_images[0] : null)

              const imageUrl = featuredImage?.image_url || "/img/property-placeholder.jpg"

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
                      <div className={styles.propertyFeature}>
                        <Home size={16} className="mr-1 text-primary-gold" /> {property.property_type}
                      </div>
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
