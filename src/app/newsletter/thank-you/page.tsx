import Link from "next/link"
import { CheckCircle } from "lucide-react"
import styles from "./thank-you.module.css"

export const metadata = {
  title: "Subscription Confirmed | Love View Estates",
  description: "Thank you for subscribing to the Love View Estates newsletter.",
}

export default function NewsletterThankYouPage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <CheckCircle className={styles.icon} />
        </div>

        <h1 className={styles.title}>Subscription Confirmed!</h1>

        <p className={styles.message}>
          Thank you for subscribing to our newsletter. You'll now receive updates on new properties, market insights,
          and exclusive offers from Love View Estates.
        </p>

        <div className={styles.links}>
          <Link href="/available-properties" className={styles.primaryLink}>
            Browse Properties
          </Link>
          <Link href="/" className={styles.secondaryLink}>
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
