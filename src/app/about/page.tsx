import Image from "next/image"
import styles from "./about.module.css"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Story | Love View Estate",
  description: "Learn about Love View Estate's journey and our commitment to excellence in property services across Ayrshire.",
  openGraph: {
    title: "Our Story | Love View Estate",
    description: "Learn about Love View Estate's journey and our commitment to excellence in property services across Ayrshire.",
    url: '/about',
    images: [
      {
        url: '/img/5.jpg',
        width: 1200,
        height: 630,
        alt: 'Love View Estate Office',
      },
    ],
  },
};

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
        
        <div className={styles.aboutImageSection}>
          <div className={styles.imageWrapper}>
            <Image src="/img/about.jpg" alt="Love View Estate property" width={600} height={400} className={styles.aboutImage} data-ai-hint="modern kitchen" />
            <p className={styles.imageCaption}>Luxurious interiors are a hallmark of our properties.</p>
          </div>
          <div className={styles.imageWrapper}>
            <Image src="/img/home.jpg" alt="A happy family in front of their new home" width={600} height={400} className={styles.aboutImage} data-ai-hint="happy family new home" />
            <p className={styles.imageCaption}>Helping families find their dream homes in Ayrshire.</p>
          </div>
        </div>
        
        <div className={styles.aboutValues}>
          <h2 className={styles.valuesHeading}>Our Core Values</h2>
          <div className={styles.valuesList}>
            <div className={styles.valueItem}>
              <h3>Integrity</h3>
              <p>We operate with honesty and transparency in all our dealings, building lasting trust with our clients.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Excellence</h3>
              <p>We are committed to delivering the highest quality service and exceeding expectations in every transaction.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Local Expertise</h3>
              <p>With deep roots in Ayrshire, our unparalleled local knowledge gives you a competitive edge.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Client-Focused</h3>
              <p>Your goals are our priority. We provide personalized service tailored to your unique property journey.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
