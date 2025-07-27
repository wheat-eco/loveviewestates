import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowLeft } from "lucide-react"
import styles from "./valuation.module.css"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Property Valuation | Love View Estate",
  description: "Get a free instant online valuation for your property in Ayrshire with Love View Estate. Find out what your home is worth for selling or renting.",
  openGraph: {
    title: "Free Property Valuation | Love View Estate",
    description: "Get a free instant online valuation for your property in Ayrshire.",
    url: '/valuation',
    images: [
      {
        url: '/img/team.jpg',
        width: 1200,
        height: 630,
        alt: 'A property valuation being conducted',
      },
    ],
  },
};

export default function ValuationPage() {
  return (
    <>
      {/* Valuation Hero Section */}
      <section className={styles.valuationHero}>
        <div className={styles.valuationContainer}>
          <div className={styles.valuationHeroContent}>
            <h1>Free Instant Online Valuation</h1>
            <p>
              We offer free instant online sales and rental valuations of your property, simply click the button on this
              page to get your results. Do remember that every property is different and we would always strongly advise
              you to take up our free no-obligation valuation in person by one of our experts to give you an accurate
              valuation of your property.
            </p>
          </div>
          <div className={styles.valuationHeroImage}>
            <Image
              src="/img/team.jpg"
              alt="Love View Estate Team"
              width={800}
              height={500}
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* Valuation Options Section */}
      <section className={styles.valuationOptionsSection}>
        <div className={styles.valuationContainer}>
          <div className={styles.valuationOptionsWrapper}>
            <Link href="/valuation/sales" className={styles.valuationOptionCard}>
              <h2>Sales Valuation</h2>
              <ArrowRight className={styles.arrowIcon} />
            </Link>
            <Link href="/valuation/rental" className={styles.valuationOptionCard}>
              <h2>Rental Valuation</h2>
              <ArrowRight className={styles.arrowIcon} />
            </Link>
          </div>

          <div className={styles.backToHome}>
            <Link href="/" className={styles.btnSecondary}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
