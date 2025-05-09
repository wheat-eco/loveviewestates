import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import styles from "./for-rent.module.css" // You might want to rename this file to for-sale.module.css

export const metadata = {
  title: "Properties For Sale | Love View Estate",
  description: "Browse our selection of properties for sale throughout Ayrshire.",
}

async function getRegionsWithPropertiesForSale() {
  const supabase = await createClient()

  // Query to get regions with properties for sale
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
    .eq("areas.properties.property_category", "sale")

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

export default async function ForSalePage() {
  const regions = await getRegionsWithPropertiesForSale()

  return (
    <section className={styles.rentalSection}>
      <div className={styles.rentalContainer}>
        <h1 className={styles.rentalHeading}>FOR SALE</h1>
        <p className={styles.rentalSubheading}>
          At Love View Estate, we offer a wide range of properties for sale throughout Ayrshire. Whether you're looking
          for a cozy apartment, a family home, or a luxury property, our experienced team can help you find the perfect
          place to call home.
        </p>

        <div className={styles.rentalLocations}>
          {regions.length > 0 ? (
            regions.map((region) => (
              <Link href={`/for-sale-${region.slug}`} key={region.id} className={styles.locationCard}>
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
                  <h2 className={styles.locationTitle}>For Sale in {region.name}</h2>
                  <p className={styles.locationDescription}>
                    Discover our selection of properties for sale in {region.name}.
                  </p>
                  <span className={styles.locationButton}>View Properties</span>
                </div>
              </Link>
            ))
          ) : (
            <p>No properties for sale available at the moment. Please check back soon.</p>
          )}
        </div>

        <div className={styles.rentalProcess}>
          <h2>Buying with Love View Estate</h2>
          <p>
            Our sales process is designed to be straightforward and hassle-free. We understand that finding the right
            property is an important decision, and our experienced team is here to guide you through every step
            of the buying process.
          </p>
          <p>
            To view our available properties, select a location above or visit our{" "}
            <Link href="/available-properties">Property Search</Link> page to see all current listings.
          </p>
          <p>
            For more information about buying with Love View Estate, please{" "}
            <Link href="/contact">contact us</Link> directly.
          </p>
        </div>
      </div>
    </section>
  )
}