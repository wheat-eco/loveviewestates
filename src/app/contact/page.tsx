
"use client"

import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { useFormState } from "react-dom"
import { useEffect, useRef } from "react"
import { submitContactForm } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Alert } from "@/components/ui/alert"
import styles from "./contact.module.css"

export default function ContactPage() {
  const initialState = { success: false, error: null, redirectUrl: null }
  const [state, formAction] = useFormState(submitContactForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success && state.redirectUrl) {
      formRef.current?.reset()
      // You can optionally show a success message before redirecting,
      // or redirect immediately. For now, let's assume a thank you page handles the message.
      window.location.href = state.redirectUrl
    }
  }, [state])

  return (
    <div className={styles.contactPage}>
      <section className={styles.heroSection} style={{ backgroundImage: "url('/img/contact-hero.jpg')" }}>
        <div className={styles.heroContent}>
          <h1>Contact Us</h1>
          <p>We're here to help you with your property journey in Ayrshire</p>
        </div>
      </section>

      <main className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2>Get in Touch</h2>
              <p>
                Whether you have a question about a listing, need a valuation, or want to discuss our services, feel
                free to reach out. Our team is ready to assist you.
              </p>

              <div className={styles.infoCard}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3>Our Office</h3>
                    <p>41 Langside Ave, Kilmarnock KA1 4SP, Scotland, UK</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3>Call Us</h3>
                    <a href="tel:+447399301948">+44 7399 301948</a>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3>Email Us</h3>
                    <a href="mailto:info@loveviewestate.co.uk">info@loveviewestate.co.uk</a>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3>Opening Hours</h3>
                    <p>
                      Mon - Fri: 9:00 AM - 6:00 PM
                      <br />
                      Sat: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.mapContainer}>
                <iframe
                  className={styles.map}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d143309.17283995484!2d-4.7861557!3d55.6414921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4889a1d95c11a5f9%3A0x5e5ea4c9e5818ef0!2sAyrshire%2C%20UK!5e0!3m2!1sen!2sus!4v1715123456789!5m2!1sen!2sus"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Love View Estate Location"
                ></iframe>
              </div>
            </div>

            <div className={styles.contactFormContainer}>
              <div className={styles.formCard}>
                <h2>Send Us a Message</h2>
                <form action={formAction} ref={formRef} className="space-y-6">
                  {state?.error && <Alert variant="error">{state.error}</Alert>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input type="text" id="name" name="name" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <Input type="email" id="email" name="email" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input type="tel" id="phone" name="phone" />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <Select id="subject" name="subject" required>
                        <option>General Inquiry</option>
                        <option>Property Valuation</option>
                        <option>Viewing Request</option>
                        <option>Landlord Services</option>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <Textarea id="message" name="message" rows={5} required />
                  </div>
                  <div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>How do I arrange a viewing?</h3>
              <p>
                You can request a viewing directly from the property details page, or you can contact us by phone or
                email with the property details, and we'll be happy to arrange it for you.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>How do I get a property valuation?</h3>
              <p>
                We offer a free, no-obligation valuation service. You can use our online valuation tool for an instant
                estimate or contact us to arrange for one of our local experts to visit your property for a more
                accurate assessment.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>What areas do you cover?</h3>
              <p>
                We primarily cover North, South, and East Ayrshire. Our deep local knowledge of these areas allows us
                to provide the best advice and service to our clients.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>What are your fees for selling a property?</h3>
              <p>
                Our fees are competitive and transparent. We'll discuss all costs with you upfront during your
                valuation. We operate on a no-sale, no-fee basis, so you only pay us when your property is successfully
                sold.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
