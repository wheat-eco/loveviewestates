import Link from "next/link"
import { CheckCircle } from "lucide-react"
import styles from "./thank-you.module.css"

export const metadata = {
  title: "Thank You | Love View Estate",
  description: "Thank you for contacting Love View Estate. We'll be in touch soon.",
}

export default function ThankYouPage() {
  return (
    <main className={styles.thankYouPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconContainer}>
            <CheckCircle className={styles.icon} />
          </div>
          <h1>Thank You!</h1>
          <p>Your message has been received. A member of our team will be in touch with you shortly.</p>
          <div className={styles.links}>
            <Link href="/" className={styles.link}>
              Return to Home
            </Link>
            <Link href="/available-properties" className={styles.link}>
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
