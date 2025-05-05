import Link from "next/link"
import Image from "next/image"
import {
  Home,
  Camera,
  Users,
  HandshakeIcon,
  FileText,
  CheckCircle,
  MapPin,
  Megaphone,
  Globe,
  MessageSquare,
  Percent,
  Star,
} from "lucide-react"
import styles from "./selling.module.css"

export const metadata = {
  title: "Selling Your Property | Love View Estate",
  description: "Expert guidance and premium marketing to achieve the best possible price for your property",
}

export default function SellingPage() {
  return (
    <main>
      {/* Selling Hero Section */}
      <section className={styles.sellingHero}>
        <div className={styles.sellingHeroContainer}>
          <div className={styles.sellingHeroContent}>
            <h1>SELLING YOUR PROPERTY</h1>
            <p>Expert guidance and premium marketing to achieve the best possible price for your property</p>
            <Link href="/valuation" className={styles.heroCTAButton}>
              Get a Free Valuation
            </Link>
          </div>
        </div>
      </section>

      {/* Selling Process Section */}
      <section className={styles.sellingProcess}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Selling Process</h2>
          <p className={styles.sectionSubtitle}>We make selling your property straightforward and stress-free</p>

          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepIcon}>
                <Home size={40} />
              </div>
              <h3>Free Valuation</h3>
              <p>
                We'll provide a free, no-obligation valuation of your property based on our extensive local market
                knowledge.
              </p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepIcon}>
                <Camera size={40} />
              </div>
              <h3>Professional Marketing</h3>
              <p>
                We create high-quality photography, detailed floor plans, and compelling descriptions to showcase your
                property.
              </p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepIcon}>
                <Users size={40} />
              </div>
              <h3>Targeted Exposure</h3>
              <p>
                Your property will be marketed across our website, major property portals, social media, and our
                extensive buyer database.
              </p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepIcon}>
                <HandshakeIcon size={40} />
              </div>
              <h3>Accompanied Viewings</h3>
              <p>We'll handle all viewings, qualifying potential buyers and providing feedback after each viewing.</p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepNumber}>5</div>
              <div className={styles.stepIcon}>
                <FileText size={40} />
              </div>
              <h3>Offer Negotiation</h3>
              <p>We'll negotiate on your behalf to secure the best possible price and terms for your property.</p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepNumber}>6</div>
              <div className={styles.stepIcon}>
                <CheckCircle size={40} />
              </div>
              <h3>Sale Progression</h3>
              <p>We'll guide you through the legal process, liaising with solicitors to ensure a smooth completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.whyChooseUs}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Love View Estate</h2>
          <p className={styles.sectionSubtitle}>We're committed to providing an exceptional service</p>

          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <MapPin size={40} />
              </div>
              <h3>Local Expertise</h3>
              <p>
                Our team has extensive knowledge of the Ayrshire property market, ensuring accurate valuations and
                effective marketing.
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Megaphone size={40} />
              </div>
              <h3>Premium Marketing</h3>
              <p>
                We use professional photography, detailed floor plans, and compelling descriptions to showcase your
                property.
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Globe size={40} />
              </div>
              <h3>Wide Exposure</h3>
              <p>
                Your property will be marketed across our website, major property portals, social media, and our
                extensive buyer database.
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <MessageSquare size={40} />
              </div>
              <h3>Dedicated Support</h3>
              <p>
                You'll have a dedicated point of contact throughout the selling process, providing regular updates and
                guidance.
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Percent size={40} />
              </div>
              <h3>Competitive Fees</h3>
              <p>We offer competitive fees with no hidden costs, ensuring you receive excellent value for money.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Star size={40} />
              </div>
              <h3>5-Star Service</h3>
              <p>
                We're proud of our 5-star reviews and testimonials from satisfied clients who have successfully sold
                their properties with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
          <div className={styles.testimonialsSlider}>
            <div className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <p>
                  "Love View Estate provided an exceptional service when selling our family home. Their local knowledge
                  and marketing expertise helped us achieve a sale price above our expectations. Highly recommended!"
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorImage}>
                  <Image src="/placeholder.svg?height=50&width=50" alt="John Smith" width={50} height={50} />
                </div>
                <div className={styles.authorInfo}>
                  <h4>John Smith</h4>
                  <p>Kilwinning</p>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <p>
                  "From valuation to completion, the team at Love View Estate were professional, responsive, and
                  supportive. They made what could have been a stressful process smooth and straightforward."
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorImage}>
                  <Image src="/placeholder.svg?height=50&width=50" alt="Sarah Johnson" width={50} height={50} />
                </div>
                <div className={styles.authorInfo}>
                  <h4>Sarah Johnson</h4>
                  <p>Kilmarnock</p>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <p>
                  "The marketing materials produced by Love View Estate were outstanding. The professional photography
                  and detailed description really showcased our property at its best, resulting in a quick sale."
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorImage}>
                  <Image src="/placeholder.svg?height=50&width=50" alt="David Wilson" width={50} height={50} />
                </div>
                <div className={styles.authorInfo}>
                  <h4>David Wilson</h4>
                  <p>Irvine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.sellingCTA}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Sell Your Property?</h2>
            <p>
              Contact us today for a free, no-obligation valuation and discover how we can help you achieve the best
              possible price for your property.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/valuation" className={`${styles.btn} ${styles.btnPrimary}`}>
                Get a Free Valuation
              </Link>
              <Link href="/contact" className={`${styles.btn} ${styles.btnSecondary}`}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
