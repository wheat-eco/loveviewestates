import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react"
import NewsletterForm from "./NewsletterForm"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column brand-column">
            <Image
              src="/logo.png"
              alt="Love View Estate"
              width={150}
              height={50}
              className="footer-logo"
            />
            <p>
              Love View Estate offers premium real estate services with a focus on exceptional properties and client
              satisfaction.
            </p>
            <div className="footer-social">
              <Link href="#" className="social-link" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="social-link" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="social-link" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="social-link" aria-label="Email">
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/our-story">About Us</Link>
              </li>
              <li>
                <Link href="/properties">Properties</Link>
              </li>
             
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Properties</h3>
            <ul className="footer-links">
              <li>
                <Link href="/for-sale-north-ayrshire">North Ayrshire For Sale</Link>
              </li>
              <li>
                <Link href="/for-sale-east-ayrshire">East Ayrshire For Sale</Link>
              </li>
              <li>
                <Link href="/to-rent-north-ayrshire">North Ayrshire To Rent</Link>
              </li>
              <li>
                <Link href="/to-rent-east-ayrshire">East Ayrshire To Rent</Link>
              </li>
              <li>
                <Link href="/valuation">Property Valuation</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Us</h3>
            <address className="footer-contact">
              <p>
                <MapPin className="h-4 w-4 mr-2 inline-block text-primary-gold" />
                123 Estate Avenue, Ayrshire
              </p>
              <p>
                <Phone className="h-4 w-4 mr-2 inline-block text-primary-gold" />
                +44 1234 567890
              </p>
              <p>
                <Mail className="h-4 w-4 mr-2 inline-block text-primary-gold" />
                info@loveviewestates.co.uk
              </p>
            </address>

            {/* Replace the old form with the new NewsletterForm component */}
            <NewsletterForm />
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Love View Estate. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/cookies-policy">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
