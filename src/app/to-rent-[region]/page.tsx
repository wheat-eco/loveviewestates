import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import styles from "../for-rent/for-rent.module.css"
import propertyStyles from "./property-listing.module.css"
import { Bed, Bath, Home, MapPin } from "lucide-react"

export async function generateMetadata({ params }: { params: { region: string } }) {
  const supabase = await createClient()

  // Get region name for the title
  const { data: region } = await supabase.from("regions").select("name").eq("slug", params.region).single()

  if (!region) {
    return {
      title: "Properties For Rent | Love View Estate",
      description: "Browse our selection of rental properties throughout Ayrshire.",
    }
  }

  return {
    title: `Properties For Rent in ${region.name} | Love View Estate`,
    description: `Browse our selection of rental properties in ${region.name}.`,
  }
}

async function getPropertiesByRegion(regionSlug: string) {
  const supabase = await createClient()

  // First, get the region ID
  const { data: region, error: regionError } = await supabase
    .from("regions")
    .select("id, name")
    .eq("slug", regionSlug)
    .single()

  if (regionError || !region) {
    return { region: null, properties: [] }
  }

  // Then get properties in that region
  const { data: properties, error: propertiesError } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      slug,
      address,
      postcode,
      property_type,
      bedrooms,
      bathrooms,
      price,
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
    .eq("status", "available")
    .order("created_at", { ascending: false })

  if (propertiesError) {
    console.error("Error fetching properties:", propertiesError)
    return { region, properties: [] }
  }

  return { region, properties }
}

export default async function RegionRentalPage({ params }: { params: { region: string } }) {
  const { region, properties } = await getPropertiesByRegion(params.region)

  if (!region) {
    notFound()
  }

  return (
    <section className={styles.rentalSection}>
      <div className={styles.rentalContainer}>
        <h1 className={styles.rentalHeading}>Properties To Rent in {region.name}</h1>
        <p className={styles.rentalSubheading}>
          Browse our selection of rental properties in {region.name}. Contact us for more information or to arrange a
          viewing.
        </p>

        {/* Filter Section - Static for now */}
        <div className={propertyStyles.filterSection}>
          <form className={propertyStyles.propertiesFilter}>
            <div className={propertyStyles.filterGroup}>
              <label htmlFor="bedrooms">Bedrooms</label>
              <select id="bedrooms" name="bedrooms">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className={propertyStyles.filterGroup}>
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

            <div className={propertyStyles.filterGroup}>
              <label htmlFor="property_type">Property Type</label>
              <select id="property_type" name="property_type">
                <option value="">Any</option>
                <option value="flat">Flat</option>
                <option value="house">House</option>
                <option value="bungalow">Bungalow</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>

            <button type="submit" className={propertyStyles.filterButton}>
              Filter Results
            </button>
          </form>
        </div>

        {/* Property Listings */}
        <div className={propertyStyles.propertiesList}>
          {properties.length > 0 ? (
            properties.map((property) => {
              // Find featured image or use first image
              const featuredImage = Array.isArray(property.property_images)
                ? property.property_images.find((img) => img.is_featured) || property.property_images[0]
                : { image_url: "/img/placeholder.svg?height=400&width=600" }

              return (
                <div key={property.id} className={propertyStyles.propertyItem}>
                  <div className={propertyStyles.propertyImageContainer}>
                    <Image
                      src={featuredImage.image_url || "/placeholder.svg"}
                      alt={String(property.title || "Property Image")}
                      width={600}
                      height={400}
                      className={propertyStyles.propertyImage}
                    />
                  </div>

                  <div className={propertyStyles.propertyDetails}>
                    <h2 className={propertyStyles.propertyTitle}>{property.title}</h2>
                    <p className={propertyStyles.propertyLocation}>
                      <MapPin size={16} className={propertyStyles.locationIcon} />
                      {property.address}, {property.postcode}
                    </p>

                    <div className={propertyStyles.propertyFeatures}>
                      <div className={propertyStyles.propertyFeature}>
                        <Bed size={18} />
                        <span>
                          {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                        </span>
                      </div>
                      <div className={propertyStyles.propertyFeature}>
                        <Bath size={18} />
                        <span>
                          {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                        </span>
                      </div>
                      <div className={propertyStyles.propertyFeature}>
                        <Home size={18} />
                        <span>{property.property_type}</span>
                      </div>
                    </div>

                    <div className={propertyStyles.propertyPriceContainer}>
                      <div className={propertyStyles.propertyPrice}>
                        £{property.price.toLocaleString()}
                        <span className={propertyStyles.pcm}>pcm</span>
                      </div>

                      <Link href={`/property/${property.slug}`} className={propertyStyles.propertyButton}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className={propertyStyles.noProperties}>
              <p>No properties currently available in this area. Please check back soon or browse our other areas.</p>
              <Link href="/for-rent" className={propertyStyles.backButton}>
                View All Rental Areas
              </Link>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className={propertyStyles.rentalCta}>
          <p>Can't find what you're looking for? Contact us and we'll help you find your perfect rental property.</p>
          <div className={propertyStyles.ctaButtons}>
            <Link href="/contact" className={`${propertyStyles.btn} ${propertyStyles.btnPrimary}`}>
              Contact Us
            </Link>
            <Link href="/rental-guide" className={`${propertyStyles.btn} ${propertyStyles.btnSecondary}`}>
              Rental Guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
