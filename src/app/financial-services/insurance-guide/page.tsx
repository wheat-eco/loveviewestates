import Image from "next/image"
import Link from "next/link"
import styles from "./insurance-guide.module.css"

export const metadata = {
  title: "Insurance Guide | Love View Estate",
  description: "A comprehensive guide to property insurance options for homeowners and landlords.",
}

export default function InsuranceGuidePage() {
  const insuranceTypes = [
    {
      id: 1,
      title: "Home Insurance",
      description:
        "Home insurance typically covers the structure of your home and your personal belongings against damage or theft. There are two main types: buildings insurance and contents insurance.",
      keyPoints: [
        "Buildings insurance covers the structure, fixtures, and fittings",
        "Contents insurance covers your personal belongings",
        "Combined policies offer comprehensive protection",
        "Additional coverage available for high-value items",
      ],
      image: "/placeholder.svg?height=300&width=500&text=Home+Insurance",
    },
    {
      id: 2,
      title: "Landlord Insurance",
      description:
        "Landlord insurance is specifically designed for property owners who rent out their properties. It provides protection beyond standard home insurance to cover risks associated with having tenants.",
      keyPoints: [
        "Buildings and contents coverage for rental properties",
        "Loss of rental income protection",
        "Landlord liability coverage",
        "Optional coverage for tenant defaults or damage",
      ],
      image: "/placeholder.svg?height=300&width=500&text=Landlord+Insurance",
    },
    {
      id: 3,
      title: "Mortgage Protection",
      description:
        "Mortgage protection insurance helps ensure your mortgage payments are covered if you're unable to make them due to illness, injury, or death.",
      keyPoints: [
        "Life insurance to pay off mortgage if you die",
        "Critical illness cover for serious health conditions",
        "Income protection for long-term illness or injury",
        "Unemployment cover for job loss (short-term protection)",
      ],
      image: "/placeholder.svg?height=300&width=500&text=Mortgage+Protection",
    },
  ]

  return (
    <div className={styles.guideContainer}>
      <div className={styles.guideContent}>
        <h1 className={styles.guideHeading}>Insurance Guide</h1>
        <p className={styles.guideIntro}>
          Understanding the right insurance for your property is essential for protecting your investment. Our partners
          at Financial Services Scotland offer expert advice on a range of insurance products tailored to your specific
          needs.
        </p>

        <div className={styles.insuranceTypes}>
          {insuranceTypes.map((insurance) => (
            <div key={insurance.id} className={styles.insuranceCard}>
              <div className={styles.insuranceImage}>
                <Image
                  src={insurance.image || "/placeholder.svg"}
                  alt={insurance.title}
                  width={500}
                  height={300}
                  className={styles.typeImage}
                />
              </div>
              <div className={styles.insuranceInfo}>
                <h2>{insurance.title}</h2>
                <p>{insurance.description}</p>
                <h3>Key Features:</h3>
                <ul>
                  {insurance.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.faqSection}>
          <h2>Frequently Asked Questions</h2>

          <div className={styles.faqItem}>
            <h3>Do I need both buildings and contents insurance?</h3>
            <p>
              If you own your home, it's advisable to have both. Buildings insurance covers the structure and permanent
              fixtures, while contents insurance covers your belongings. If you're renting, you typically only need
              contents insurance as the landlord should insure the building.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>What factors affect my insurance premium?</h3>
            <p>
              Several factors can influence your premium, including the property's location, age, construction type,
              security features, claims history, and the level of coverage you choose. For landlord insurance, the type
              of tenants and rental agreement can also impact costs.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>Is mortgage protection insurance required?</h3>
            <p>
              While not legally required, mortgage protection insurance is often recommended to ensure your mortgage
              payments are covered if you're unable to work due to illness, injury, or death. Some lenders may require
              it as a condition of your mortgage.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>How do I know if I'm adequately insured?</h3>
            <p>
              It's important to regularly review your insurance coverage, especially after home improvements, purchasing
              valuable items, or changes in circumstances. Our financial advisors can help assess your needs and ensure
              you have appropriate coverage.
            </p>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h2>Get Expert Insurance Advice</h2>
          <p>
            Our partners at Financial Services Scotland can help you navigate the complex world of insurance and find
            the right coverage for your needs. Contact them today for a personalized consultation.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/financial-services" className={styles.primaryButton}>
              Back to Financial Services
            </Link>
            <a href="tel:01294539267" className={styles.secondaryButton}>
              Call for Advice: 01294 539267
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
