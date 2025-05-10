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
            Love View Estate was established in October 2018 offering an Estate Agency & Residential Letting service throughout Ayrshire.
          </p>
          
          <p>
            The business is owned and managed by Michael Connelly. Mel has worked in the property sector between North/East Ayrshire for 16 years, in both lettings & estate agency.
          </p>
          
          <p>
            The business plan originally for Love View Estate was to be a letting agency for residential properties with a view to eventually offering estate agency services. However whilst the office was still being set up the amount of enquiries that came through from people asking if we were going to do estate agency made us do it from the onset.
          </p>
          
          <p>
            The majority of our business is in estate agency however the rental portfolio is growing fast as we are a qualified & regulated agent in residential letting.
          </p>
          
          <p>
            Over the past 4 years Love View Estate have took the property market by storm, paving a way to being one of the main agents for both Letting & Sales located in North Ayrshire. Achieving so many milestones in a short space of time.
          </p>
          
          <p>
            We are now delighted to have our 2nd branch in East Ayrshire in prime location at 37 John Finnie St, Kilmarnock which opened its doors in September 2020.
          </p>
          
          <p>
            Working with integrity and in the best interests of our clients is our main priority at Love View Estate.
          </p>
        </div>
        
        <div className={styles.aboutImageSection}>
          <div className={styles.imageWrapper}>
            <Image 
              src="/placeholder.svg?height=400&width=600&text=Our+Office" 
              alt="Love View Estate Office" 
              width={600} 
              height={400}
              className={styles.aboutImage}
            />
            <span className={styles.imageCaption}>Our North Ayrshire Branch</span>
          </div>
          
          <div className={styles.imageWrapper}>
            <Image 
              src="/placeholder.svg?height=400&width=600&text=Kilmarnock+Branch" 
              alt="Love View Estate Kilmarnock Branch" 
              width={600} 
              height={400}
              className={styles.aboutImage}
            />
            <span className={styles.imageCaption}>Our East Ayrshire Branch in Kilmarnock</span>
          </div>
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
