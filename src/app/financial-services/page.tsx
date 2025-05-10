import Image from "next/image"
import Link from "next/link"
import styles from "./financial-services.module.css"
import { Phone, Mail, MapPin } from "lucide-react"

export const metadata = {
  title: "Financial Services | Love View Estate",
  description:
    "Expert financial advice for property buyers, sellers, and investors through our trusted partnership with Financial Services Scotland.",
}

export default function FinancialServicesPage() {
  return (
    <div className={styles.financialContainer}>
      <div className={styles.financialContent}>
        <h1 className={styles.financialHeading}>FINANCIAL SERVICES</h1>

        <div className={styles.partnershipSection}>
          <div className={styles.partnerLogo}>
            <Image
              src="/placeholder.svg?height=150&width=150&text=Financial+Services"
              alt="Financial Services Scotland Logo"
              width={150}
              height={150}
              className={styles.logoImage}
            />
          </div>
          <div className={styles.partnerInfo}>
            <p>
              Love View Estate are delighted to have a partnership with Financial Services Scotland based in Stevenston,
              North Ayrshire. Financial Services Scotland offer an award-winning, independent financial advice service
              providing expert advice tailored to your needs.
            </p>
            <p>
              At Financial Services Scotland they recognise that every customer's circumstances and objectives are
              different. Therefore, the more they get to know you, the more they can tailor their recommendations to you
              to help you meet your goals. Their aim is to help you achieve long-term financial security and prosperity.
            </p>
          </div>
        </div>

        <div className={styles.servicesSection}>
          <h2>They offer advice in:</h2>
          <ul className={styles.servicesList}>
            <li>
              <div className={styles.serviceItem}>
                <h3>Mortgage/Home Finance</h3>
                <p>
                  Expert advice on mortgages and home financing options to help you secure the best rates and terms for
                  your property purchase.
                </p>
              </div>
            </li>
            <li>
              <div className={styles.serviceItem}>
                <h3>Equity Release</h3>
                <p>
                  Solutions for homeowners looking to access the equity tied up in their property while continuing to
                  live there.
                </p>
              </div>
            </li>
            <li>
              <div className={styles.serviceItem}>
                <h3>Personal Protection</h3>
                <p>
                  Including Life, Critical Illness, Family and Income Protection to ensure you and your loved ones are
                  financially secure.
                </p>
              </div>
            </li>
            <li>
              <div className={styles.serviceItem}>
                <h3>Business Protection</h3>
                <p>
                  Including Relevant Life, Shareholder protection and Key Person Insurance to safeguard your business
                  interests.
                </p>
              </div>
            </li>
            <li>
              <div className={styles.serviceItem}>
                <h3>Home Insurance</h3>
                <p>
                  Comprehensive coverage options to protect your property and possessions against damage, theft, and
                  other risks.
                </p>
              </div>
            </li>
            <li>
              <div className={styles.serviceItem}>
                <h3>Landlord Insurance</h3>
                <p>
                  Specialized insurance products designed specifically for landlords to protect their rental properties
                  and income.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className={styles.contactSection}>
          <h2>Get in Touch</h2>
          <p>If you would like any further information on any of these services please get in touch with the team:</p>
          <div className={styles.contactDetails}>
            <div className={styles.contactItem}>
              <Phone className={styles.contactIcon} />
              <a href="tel:01294539267" className={styles.contactLink}>
                01294 539267
              </a>
            </div>
            <div className={styles.contactItem}>
              <Mail className={styles.contactIcon} />
              <a href="mailto:info@fsscotlandltd.co.uk" className={styles.contactLink}>
                info@fsscotlandltd.co.uk
              </a>
            </div>
            <div className={styles.contactItem}>
              <MapPin className={styles.contactIcon} />
              <address className={styles.contactAddress}>1 Glebe Street, Stevenston, KA20 3EN</address>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h2>Ready to take the next step?</h2>
          <p>
            Our partners at Financial Services Scotland offer a free initial consultation to discuss your needs and
            objectives. Schedule yours today.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className={styles.primaryButton}>
              Request a Callback
            </Link>
            <a href="tel:01294539267" className={styles.secondaryButton}>
              Call Directly
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
