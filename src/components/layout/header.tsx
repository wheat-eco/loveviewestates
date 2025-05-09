"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  ChevronDown,
  XIcon,
  MapPin,
  Home,
  DollarSign,
  Briefcase,
  FileText,
  Users,
  Star,
  Search,
  Phone,
} from "lucide-react"

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

  // Check if a path is active
  const isActive = (path: string) => {
    if (!pathname) return false
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <Link href="/">
              <Image src="/logo.png" alt="Love View Estate" width={180} height={60} className="logo" />
            </Link>
          </div>

          <div className="nav-container">
            <nav className="main-nav">
              <ul className="nav-list">
                <li className="nav-item dropdown">
                  <Link
                    href="/about"
                    className={`nav-link  || isActive("/team") || isActive("/testimonials") ? "active" : ""}`}
                  >
                    ABOUT <ChevronDown className="inline h-4 w-4 ml-1" />
                  </Link>
                  <div className="dropdown-content">
                    
                    <Link href="/team">
                      <Users className="h-4 w-4" /> Team
                    </Link>
                    <Link href="/testimonials">
                      <Star className="h-4 w-4" /> Testimonials
                    </Link>
                  </div>
                </li>

                <li className="nav-item">
                  <Link href="/selling" className={`nav-link ${isActive("/selling") ? "active" : ""}`}>
                    SELLING
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <Link
                    href="/for-sale"
                    className={`nav-link ${isActive("/for-sale") || isActive("/for-sale-north-ayrshire") || isActive("/for-sale-east-ayrshire") ? "active" : ""}`}
                  >
                    FOR SALE <ChevronDown className="inline h-4 w-4 ml-1" />
                  </Link>
                  <div className="dropdown-content">
                    <div className="dropdown-heading">Properties For Sale</div>
                    <Link href="/for-sale-north-ayrshire">
                      <MapPin className="h-4 w-4" /> For Sale North Ayrshire
                    </Link>
                    <Link href="/for-sale-east-ayrshire">
                      <MapPin className="h-4 w-4" />For Sale East Ayrshire
                    </Link>
                     </div>
                    
                   
                </li>

                <li className="nav-item dropdown">
                  <Link
                    href="/to-rent"
                    className={`nav-link ${isActive("/to-rent") || isActive("/to-rent-north-ayrshire") || isActive("/to-rent-east-ayrshire") || isActive("/rental-guide") ? "active" : ""}`}
                  >
                    FOR RENT <ChevronDown className="inline h-4 w-4 ml-1" />
                  </Link>
                  <div className="dropdown-content">
                    <div className="dropdown-heading">Properties For Rent</div>
                    <Link href="/available-properties">
                      <Home className="h-4 w-4" /> Available Properties
                    </Link>
                    <Link href="/to-rent-north-ayrshire">
                      <MapPin className="h-4 w-4" /> To Rent North Ayrshire
                    </Link>
                    <Link href="/to-rent-east-ayrshire">
                      <MapPin className="h-4 w-4" /> To Rent East Ayrshire
                    </Link>
                   </div>
                </li>

                <li className="nav-item">
                  <Link
                    href="/financial-services"
                    className={`nav-link ${isActive("/financial-services") ? "active" : ""}`}
                  >
                    FINANCIAL SERVICES
                  </Link>
                </li>

                <li className="nav-item">
  <Link href="/landlords" className={`nav-link ${isActive("/landlords") ? "active" : ""}`}>
    LANDLORDS
  </Link>
</li>

                <li className="nav-item">
                  <Link href="/valuation" className="nav-link highlight-button">
                    INSTANT VALUATION
                  </Link>
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
            <Link href="mailto:info@loveviewestate.com" className="social-link" aria-label="Email">
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

      {/* Mobile Menu - Keeping the existing mobile menu as requested */}
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
               
              </ul>
            </li>
            <li>
              <Link href="/selling" onClick={closeMobileMenu}>
                SELLING
              </Link>
            </li>
            <li>
              {" "}
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
              {" "}
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
                   For Rent North Ayrshire
                  </Link>
                </li>
                <li>
                  <Link href="/to-rent-east-ayrshire" onClick={closeMobileMenu}>
                   For Rent East Ayrshire
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
