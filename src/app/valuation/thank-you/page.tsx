import Link from "next/link"
import { CheckCircle, Phone, Home, FileText } from "lucide-react"
import styles from "./thank-you.module.css"

export const metadata = {
  title: "Thank You for Your Valuation Request | Love View Estate",
  description: "Thank you for submitting your valuation request with Love View Estate.",
}

export default function ThankYouPage() {
  return (
    <section className={styles.thankYouSection}>
      <div className={styles.container}>
        <div className={styles.thankYouContent}>
          <div className={styles.thankYouIcon}>
            <CheckCircle size={80} />
          </div>

          <h1>Thank You for Your Valuation Request</h1>

          <p>
            We have received your valuation request and one of our property experts will be in touch with you shortly.
          </p>

          <div className={styles.nextSteps}>
            <h2>What happens next?</h2>
            <ul>
              <li>
                <Phone size={24} />
                <div>
                  <h3>We'll call you</h3>
                  <p>One of our property experts will call you within 24 hours to discuss your valuation.</p>
                </div>
              </li>
              <li>
                <Home size={24} />
                <div>
                  <h3>Property visit</h3>
                  <p>We'll arrange a convenient time to visit your property for a detailed assessment.</p>
                </div>
              </li>
              <li>
                <FileText size={24} />
                <div>
                  <h3>Detailed valuation</h3>
                  <p>You'll receive a comprehensive valuation report with our expert recommendations.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.ctaButtons}>
            <Link href="/" className={styles.btnPrimary}>
              Return to Home
            </Link>
            <Link href="/contact" className={styles.btnSecondary}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
