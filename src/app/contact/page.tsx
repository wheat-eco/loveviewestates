import Image from "next/image"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { submitContactForm } from "./actions"
import ContactForm from "@/components/contact/ContactForm"
import styles from "./contact.module.css"

export const metadata = {
  title: "Contact Us | Love View Estate",
  description: "Get in touch with Love View Estate. We're here to help with all your property needs.",
}

export default function ContactPage() {
  return (
    <main className={styles.contactPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Contact Us</h1>
          <p>We're here to help with all your property needs</p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2>Get In Touch</h2>
              <p>
                Whether you're looking to buy, sell, or rent a property, our team of experienced professionals is here
                to help you every step of the way.
              </p>

              <div className={styles.infoCard}>
                <div className={styles.infoItem}>
                  <MapPin className={styles.infoIcon} />
                  <div>
                    <h3>Visit Us</h3>
                    <p>123 Estate Avenue</p>
                    <p>Ayrshire, KA12 8DP</p>
                    <p>Scotland, UK</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Phone className={styles.infoIcon} />
                  <div>
                    <h3>Call Us</h3>
                    <p>
                      <a href="tel:+441234567890">+44 1234 567890</a>
                    </p>
                    <p>
                      <a href="tel:+441234567891">+44 1234 567891</a> (Rentals)
                    </p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Mail className={styles.infoIcon} />
                  <div>
                    <h3>Email Us</h3>
                    <p>
                      <a href="mailto:info@loveviewestate.com">info@loveviewestate.com</a>
                    </p>
                    <p>
                      <a href="mailto:rentals@loveviewestate.com">rentals@loveviewestate.com</a>
                    </p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Clock className={styles.infoIcon} />
                  <div>
                    <h3>Opening Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d143309.17283995484!2d-4.7861557!3d55.6414921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4889a1d95c11a5f9%3A0x5e5ea4c9e5818ef0!2sAyrshire%2C%20UK!5e0!3m2!1sen!2sus!4v1715123456789!5m2!1sen!2sus"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Love View Estate Location"
                  className={styles.map}
                ></iframe>
              </div>
            </div>

            <div className={styles.contactFormContainer}>
              <div className={styles.formCard}>
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                <ContactForm submitContactForm={submitContactForm} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.container}>
          <h2>Our Team Is Ready To Help</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.teamImageContainer}>
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Sarah Johnson"
                  width={300}
                  height={300}
                  className={styles.teamImage}
                />
              </div>
              <h3>Sarah Johnson</h3>
              <p>Sales Director</p>
              <a href="mailto:sarah@loveviewestate.com">sarah@loveviewestate.com</a>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.teamImageContainer}>
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Michael Thompson"
                  width={300}
                  height={300}
                  className={styles.teamImage}
                />
              </div>
              <h3>Michael Thompson</h3>
              <p>Lettings Manager</p>
              <a href="mailto:michael@loveviewestate.com">michael@loveviewestate.com</a>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.teamImageContainer}>
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Emma Wilson"
                  width={300}
                  height={300}
                  className={styles.teamImage}
                />
              </div>
              <h3>Emma Wilson</h3>
              <p>Property Valuer</p>
              <a href="mailto:emma@loveviewestate.com">emma@loveviewestate.com</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
