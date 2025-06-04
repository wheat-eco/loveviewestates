import Image from "next/image"
import styles from "./about.module.css"

export const metadata = {
  title: "Our Story | Love View Estate",
  description: "Learn about Love View Estate's journey and our commitment to excellence in property services across Ayrshire.",
}

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        <h1 className={styles.aboutHeading}>ABOUT LOVE VIEW ESTATE</h1>
        
        <div className={styles.aboutText}>
          <p>
            Welcome to Love View Estates - your trusted partner in property across North, South, and East Ayrshire.   </p>
          
          <p>
              As a fresh and dynamic letting and estate agency committed to delivering high-quality, competitively priced rental properties and outstanding service for both tenants and landlords. </p>
          
          <p>Whether you're looking for a fully managed rental solution, tenant-finding services, or expert support to buy or sell your home for the best possible price, we're here to guide you every step of the way.

               </p>
          
          <p>
             At Love View Estates, we combine professionalism, efficiency, and in-depth local knowledge to make your property journey smooth, stress-free, and successful </p>
          
         
        </div>
        
        
        
        <div className={styles.aboutValues}>
          <h2 className={styles.valuesHeading}>Our Values</h2>
          <div className={styles.valuesList}>
            <div className={styles.valueItem}>
              <h3>Integrity</h3>
              <p>We operate with honesty and transparency in all our dealings.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Excellence</h3>
              <p>We strive to deliver the highest quality service to our clients.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Local Expertise</h3>
              <p>With over 16 years of experience in Ayrshire, we know the local market inside out.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Client-Focused</h3>
              <p>Our clients' best interests are always our top priority.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
