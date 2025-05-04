import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import styles from "./for-rent.module.css"

export const metadata = {
  title: "Properties For Rent | Love View Estate",
  description: "Browse our selection of rental properties throughout Ayrshire.",
}

async function getRegionsWithRentalProperties() {
  const supabase = await createClient()

  // Query to get regions with rental property counts
  const { data: regions, error } = await supabase
    .from("regions")
    .select(`
      id, 
      name, 
      slug,
      areas!inner (
        id,
        properties!inner (
          id,
          property_category
        )
      )
    `)
    .eq("areas.properties.property_category", "rent")

  if (error) {
    console.error("Error fetching regions:", error)
    return []
  }

  // Process data to get counts and filter regions with properties
  const regionsWithCounts = regions
    .map((region) => ({
      id: region.id,
      name: region.name,
      slug: region.slug,
      property_count: region.areas.reduce((count, area) => count + area.properties.length, 0),
    }))
    .filter((region) => region.property_count > 0)
    .sort((a, b) => a.name.localeCompare(b.name))

  return regionsWithCounts
}

export default async function ForRentPage() {
  const regions = await getRegionsWithRentalProperties()

  return (
    <section className={styles.rentalSection}>
      <div className={styles.rentalContainer}>
        <h1 className={styles.rentalHeading}>FOR RENT</h1>
        <p className={styles.rentalSubheading}>
          At Love View Estate, we offer a wide range of rental properties throughout Ayrshire. Whether you're looking
          for a cozy apartment, a family home, or a luxury property, our experienced team can help you find the perfect
          place to call home.
        </p>

        <div className={styles.rentalLocations}>
          {regions.length > 0 ? (
            regions.map((region) => (
              <Link href={`/to-rent-${region.slug}`} key={region.id} className={styles.locationCard}>
                <div className={styles.locationImage}>
                  <Image
                    src={`/img/${region.id % 2 === 0 ? "2" : "1"}.jpg`}
                    alt={`${region.name} Properties`}
                    width={600}
                    height={400}
                    className={styles.locationImg}
                  />
                </div>
                <div className={styles.locationContent}>
                  <h2 className={styles.locationTitle}>To Rent {region.name}</h2>
                  <p className={styles.locationDescription}>
                    Discover our selection of rental properties in {region.name}.
                  </p>
                  <span className={styles.locationButton}>View Properties</span>
                </div>
              </Link>
            ))
          ) : (
            <p>No rental properties available at the moment. Please check back soon.</p>
          )}
        </div>

        <div className={styles.rentalProcess}>
          <h2>Renting with Love View Estate</h2>
          <p>
            Our rental process is designed to be straightforward and hassle-free. We understand that finding the right
            rental property is an important decision, and our experienced team is here to guide you through every step
            of the process.
          </p>
          <p>
            To view our available properties, select a location above or visit our{" "}
            <Link href="/available-properties">Available Properties</Link> page to see all current listings.
          </p>
          <p>
            For more information about renting with Love View Estate, please visit our{" "}
            <Link href="/rental-guide">Rental Guide</Link> or <Link href="/contact">contact us</Link> directly.
          </p>
        </div>
      </div>
    </section>
  )
}
