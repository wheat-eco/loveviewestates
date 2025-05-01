import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import { Bed, Bath, Home, MapPin, Calendar } from "lucide-react"
import styles from "./available-properties.module.css"

export const metadata = {
  title: "Available Rental Properties | Love View Estate",
  description: "Browse our current selection of available rental properties across Ayrshire",
}

async function getAvailableProperties() {
  const supabase = await createClient()

  // Get all available rental properties
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
    .eq("property_category", "rent")
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
    <section className={styles.rentalSection}>
      <div className={styles.rentalContainer}>
        <h1 className={styles.rentalHeading}>AVAILABLE PROPERTIES</h1>
        <p className={styles.rentalSubheading}>
          Browse our current selection of available rental properties across Ayrshire
        </p>

        {/* Filter Section */}
        <div className={styles.filterSection}>
          <form className={styles.propertiesFilter}>
            <div className={styles.filterGroup}>
              <label htmlFor="bedrooms">Bedrooms</label>
              <select id="bedrooms" name="bedrooms">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="price">Max Price</label>
              <select id="price" name="price">
                <option value="">Any</option>
                <option value="500">£500 pcm</option>
                <option value="750">£750 pcm</option>
                <option value="1000">£1,000 pcm</option>
                <option value="1500">£1,500 pcm</option>
                <option value="2000">£2,000 pcm</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="property_type">Property Type</label>
              <select id="property_type" name="property_type">
                <option value="">Any</option>
                <option value="Apartment">Apartment</option>
                <option value="Terraced">Terraced</option>
                <option value="Semi-Detached">Semi-Detached</option>
                <option value="Detached">Detached</option>
                <option value="Bungalow">Bungalow</option>
              </select>
            </div>

            <button type="submit" className={styles.filterButton}>
              Filter Results
            </button>
          </form>
        </div>

        {/* Property Listings */}
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
                      {property.address} (
                      {Array.isArray(property.areas)
                        ? property.areas
                            .map((area) =>
                              Array.isArray(area.regions)
                                ? area.regions.map((region) => region.name).join(", ")
                                : "No regions"
                            )
                            .join("; ")
                        : "No areas available"}
                      )
                    </p>

                    <div className={styles.propertyFeatures}>
                      <div className={styles.propertyFeature}>
                        <MapPin size={16} className="mr-1 text-primary-gold" />
                        {Array.isArray(property.areas)
                          ? property.areas.map((area) => area.name).join(", ")
                          : "No areas available"}
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
                        £{property.price} <span className={styles.pcm}>PCM</span>
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
              <p>No rental properties available at the moment. Please check back soon.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className={styles.rentalCta}>
          <p>Can't find what you're looking for? Contact our rental team for assistance.</p>
          <Link href="/contact" className={styles.btnPrimary}>
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
