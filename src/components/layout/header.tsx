"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Mail, ChevronDown, XIcon } from "lucide-react"

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdowns, setActiveDropdowns] = useState<string[]>([])
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (!mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    document.body.style.overflow = ""
  }

  const toggleMobileDropdown = (id: string) => {
    setActiveDropdowns((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992 && mobileMenuOpen) {
        closeMobileMenu()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mobileMenuOpen])

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <Link href="/">
              <Image src="/img/love-view-logo.png" alt="Love View Estate" width={180} height={60} className="logo" />
            </Link>
          </div>

          <div className="nav-container">
            <nav className="main-nav top-nav">
              <ul className="nav-list">
                <li className="nav-item dropdown">
                  <Link href="#" className="nav-link">
                    ABOUT <ChevronDown className="inline h-4 w-4 ml-1" />
                  </Link>
                  <div className="dropdown-content">
                    <Link href="/our-story">Our Story</Link>
                    <Link href="/team">Team</Link>
                    <Link href="/testimonials">Testimonials</Link>
                  </div>
                </li>
                <li className="nav-item">
                  <Link href="/selling" className="nav-link">
                    SELLING
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/for-sale-north-ayrshire" className="nav-link">
                    FOR SALE NORTH AYRSHIRE
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/for-sale-east-ayrshire" className="nav-link">
                    FOR SALE EAST AYRSHIRE
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/valuation" className="nav-link highlight-button">
                    INSTANT VALUATION
                  </Link>
                </li>
              </ul>
            </nav>
            <nav className="main-nav bottom-nav">
              <ul className="nav-list">
                <li className="nav-item">
                  <Link href="/financial-services" className="nav-link">
                    FINANCIAL SERVICES
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/landlords" className="nav-link">
                    LANDLORDS
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    href="/for-rent"
                    className={`nav-link ${
                      pathname.includes("/for-rent") ||
                      pathname.includes("/to-rent") ||
                      pathname.includes("/available-properties")
                        ? "active"
                        : ""
                    }`}
                  >
                    FOR RENT <ChevronDown className="inline h-4 w-4 ml-1" />
                  </Link>
                  <div className="dropdown-content">
                    <Link href="/available-properties">Available Properties</Link>
                    <Link href="/to-rent-north-ayrshire">North Ayrshire</Link>
                    <Link href="/to-rent-east-ayrshire">East Ayrshire</Link>
                    <Link href="/rental-guide">Rental Guide</Link>
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          <div className="social-container">
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

          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        <button className="mobile-menu-close" onClick={closeMobileMenu} aria-label="Close menu">
          <XIcon className="h-6 w-6" />
        </button>
        <nav>
          <ul>
            <li className={`mobile-dropdown ${activeDropdowns.includes("about") ? "active" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  toggleMobileDropdown("about")
                }}
              >
                ABOUT <ChevronDown className="inline h-4 w-4 ml-1" />
              </a>
              <ul className="mobile-dropdown-content">
                <li>
                  <Link href="/our-story" onClick={closeMobileMenu}>
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/team" onClick={closeMobileMenu}>
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" onClick={closeMobileMenu}>
                    Testimonials
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/selling" onClick={closeMobileMenu}>
                SELLING
              </Link>
            </li>
            <li>
              <Link href="/for-sale-north-ayrshire" onClick={closeMobileMenu}>
                FOR SALE NORTH AYRSHIRE
              </Link>
            </li>
            <li>
              <Link href="/for-sale-east-ayrshire" onClick={closeMobileMenu}>
                FOR SALE EAST AYRSHIRE
              </Link>
            </li>
            <li>
              <Link href="/financial-services" onClick={closeMobileMenu}>
                FINANCIAL SERVICES
              </Link>
            </li>
            <li>
              <Link href="/landlords" onClick={closeMobileMenu}>
                LANDLORDS
              </Link>
            </li>
            <li className={`mobile-dropdown ${activeDropdowns.includes("rent") ? "active" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  toggleMobileDropdown("rent")
                }}
              >
                FOR RENT <ChevronDown className="inline h-4 w-4 ml-1" />
              </a>
              <ul className="mobile-dropdown-content">
                <li>
                  <Link href="/available-properties" onClick={closeMobileMenu}>
                    Available Properties
                  </Link>
                </li>
                <li>
                  <Link href="/to-rent-north-ayrshire" onClick={closeMobileMenu}>
                    North Ayrshire
                  </Link>
                </li>
                <li>
                  <Link href="/to-rent-east-ayrshire" onClick={closeMobileMenu}>
                    East Ayrshire
                  </Link>
                </li>
                <li>
                  <Link href="/rental-guide" onClick={closeMobileMenu}>
                    Rental Guide
                  </Link>
                </li>
                <li>
                  <Link href="/apply-now" onClick={closeMobileMenu}>
                    Apply Now
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/valuation" className="mobile-highlight" onClick={closeMobileMenu}>
                INSTANT VALUATION
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mobile-social">
          <Link href="#" aria-label="Facebook" onClick={closeMobileMenu}>
            <Facebook className="h-5 w-5" />
          </Link>
          <Link href="#" aria-label="Twitter" onClick={closeMobileMenu}>
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="#" aria-label="Instagram" onClick={closeMobileMenu}>
            <Instagram className="h-5 w-5" />
          </Link>
          <Link href="#" aria-label="Email" onClick={closeMobileMenu}>
            <Mail className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Overlay for closing mobile menu when clicking outside */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`} onClick={closeMobileMenu}></div>
    </>
  )
}

export default Header
