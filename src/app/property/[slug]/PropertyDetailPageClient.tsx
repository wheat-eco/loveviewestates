
"use client"

import { useState, useRef, type FormEvent, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  FileText,
  ArrowLeft,
  Bed,
  Bath,
  Home,
  Calendar,
  Facebook,
  Twitter,
  Share2,
  Check,
  Info,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  User,
  Maximize2,
} from "lucide-react"
import styles from "./property-detail.module.css"

// Property interface
interface Property {
  id: string
  title: string
  slug: string
  description: string
  address: string
  postcode: string
  bedrooms: number
  bathrooms: number
  price: number
  available_date: string
  status: string
  property_types?: {
    display_name: string
  } | null
  property_categories?: {
    name: string
  } | null
  property_images: {
    id: string
    image_url: string
    caption: string
    is_featured: boolean
    display_order: number
  }[]
  property_features: {
    id: string
    feature_name: string
  }[]
  property_details: {
    furnished_status: string
    epc_rating: string
    council_tax_band: string
    deposit_amount: number
    pets_policy: string
    smoking_policy: string
  }
  property_documents: {
    id: string
    document_url: string
    document_name: string
    document_type?: string
  }[]
}

interface PropertyDetailPageProps {
  property: Property
  area: string | null
  region: string | null
}

export default function PropertyDetailPageClient({ property, area, region }: PropertyDetailPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [isSticky, setIsSticky] = useState(false)

  const sidebarRef = useRef<HTMLDivElement>(null)

  // Sort images - featured first, then by display order
  const sortedImages = [...(property.property_images || [])].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1
    if (!a.is_featured && b.is_featured) return 1
    return (a.display_order || 0) - (b.display_order || 0)
  })

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Handle image navigation
  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1))
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentImageIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1))
  }
  
  const handleThumbnailClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setIsGalleryOpen(true);
    setCurrentImageIndex(index);
  }

  // Format price based on property type
  const formatPrice = () => {
    const formattedPrice = property.price?.toLocaleString() || "0"
    return property.property_categories?.name === "rent" ? `£${formattedPrice} pcm` : `£${formattedPrice}`
  }

  // Get property status label
  const getStatusLabel = () => {
    if (property.status === "let_agreed") return "LET AGREED"
    if (property.status === "sale_agreed") return "SALE AGREED"
    if (property.status === "under_offer") return "UNDER OFFER"
    if (property.status === "sold") return "SOLD"
    return property.property_categories?.name === "rent" ? "TO LET" : "FOR SALE"
  }

  // Get EPC document
  const epcDocument = property.property_documents?.find((doc) => doc.document_type === "EPC")
  const floorPlanDocument = property.property_documents?.find((doc) => doc.document_type === "Floorplan")

  // Social sharing functions
  const handleShare = (platform: "facebook" | "twitter" | "pinterest") => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(`${property.title} - Love View Estate`)
    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case "pinterest":
        const media = encodeURIComponent(sortedImages[0]?.image_url || "")
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${title}`
        break
    }
    window.open(shareUrl, "_blank")
  }


  const toggleGallery = () => {
    setIsGalleryOpen(!isGalleryOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current && window.innerWidth >= 1024) {
        const sidebar = sidebarRef.current
        const mainContent = document.querySelector(`.${styles.mainContent}`) as HTMLElement;
        if (!mainContent) return;

        const { top } = mainContent.getBoundingClientRect();
        const sidebarHeight = sidebar.clientHeight;
        const mainContentHeight = mainContent.clientHeight;
        
        if (top <= 80 && (top + mainContentHeight) > sidebarHeight) {
          setIsSticky(true)
        } else {
          setIsSticky(false)
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])
  

  return (
    <div className={styles.propertyDetailContainer}>
      <div className={styles.headerLeft}>
        <div className={styles.backLink}>
          <Link href="/available-properties">
            <ArrowLeft size={16} />
            <span>Back to Properties</span>
          </Link>
        </div>
        <h1 className={styles.propertyTitle}>{property.title}</h1>
        <p className={styles.propertyAddress}>
          <MapPin size={16} className={styles.iconGold} />
          {property.address}, {area || ""} {region ? `(${region})` : ""}
        </p>
      </div>

      {sortedImages.length > 0 && (
         <div className={styles.gallery}>
          {sortedImages.slice(0, 3).map((image, index) => (
             <div key={image.id} className={styles.galleryImage} onClick={(e) => handleThumbnailClick(e, index)}>
               <Image
                 src={image.image_url || "/placeholder.svg"}
                 alt={image.caption || `${property.title} - Image ${index + 1}`}
                 width={800}
                 height={600}
                 priority={index === 0}
               />
             </div>
           ))}
           <button className={styles.viewGalleryButton} onClick={toggleGallery}>
             <Maximize2 size={16} />
             View All Photos
           </button>
         </div>
      )}


      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && (
        <div className={styles.galleryModal} onClick={toggleGallery}>
          <div className={styles.galleryModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeGallery} onClick={toggleGallery}>
              &times;
            </button>
            <div className={styles.galleryMainImage}>
              <Image
                src={sortedImages[currentImageIndex]?.image_url || "/placeholder.svg"}
                alt={property.title}
                width={1600}
                height={1200}
                className={styles.fullscreenImage}
              />
            </div>
              <button className={`${styles.galleryNavButton} ${styles.prev}`} onClick={handlePrev}>
                <ChevronLeft size={24} />
              </button>
              <button className={`${styles.galleryNavButton} ${styles.next}`} onClick={handleNext}>
                <ChevronRight size={24} />
              </button>
              <div className={styles.galleryCounter}>
                {currentImageIndex + 1} / {sortedImages.length}
              </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        <div className={styles.mainContent}>
          <div className={styles.headerRight}>
            <div className={styles.propertyPrice}>{formatPrice()}</div>
            <div className={styles.statusBadge}>{getStatusLabel()}</div>
          </div>
          
          <div className={styles.keyDetailsBar}>
            <div className={styles.keyDetail}><Bed size={20} className={styles.detailIcon} /><span>{property.bedrooms} Bed{property.bedrooms !== 1 ? "s" : ""}</span></div>
            <div className={styles.keyDetail}><Bath size={20} className={styles.detailIcon} /><span>{property.bathrooms} Bath{property.bathrooms !== 1 ? "s" : ""}</span></div>
            <div className={styles.keyDetail}><Home size={20} className={styles.detailIcon} /><span>{property.property_types?.display_name}</span></div>
            {property.available_date && (<div className={styles.keyDetail}><Calendar size={20} className={styles.detailIcon} /><span>Available {new Date(property.available_date).toLocaleDateString("en-GB")}</span></div>)}
          </div>
          
          <div className={styles.tabsList}>
            <button className={`${styles.tabButton} ${activeTab === "description" ? styles.active : ""}`} onClick={() => setActiveTab("description")}>Description</button>
            <button className={`${styles.tabButton} ${activeTab === "features" ? styles.active : ""}`} onClick={() => setActiveTab("features")}>Features</button>
            {floorPlanDocument && (<button className={`${styles.tabButton} ${activeTab === "floorplan" ? styles.active : ""}`} onClick={() => setActiveTab("floorplan")}>Floor Plan</button>)}
          </div>

          <div className={styles.tabContent}>
             {activeTab === "description" && ( <div className={styles.descriptionContent}>{property.description ? property.description.split("\n").map((p, i) => <p key={i}>{p}</p>) : <p>No description available.</p>}</div> )}
             {activeTab === "features" && (
                <div>
                  <div className={styles.contentSection}>
                     <h3 className={styles.sectionTitle}>Key Features</h3>
                     <div className={styles.featuresGrid}>
                       {property.property_features.map((feature) => ( <div key={feature.id} className={styles.featureItem}><Check size={16} className={styles.iconGold} /><span>{feature.feature_name}</span></div> ))}
                     </div>
                  </div>
                  <div className={styles.contentSection}>
                    <h3 className={styles.sectionTitle}>Additional Details</h3>
                    <div className={styles.detailsGrid}>
                       {property.property_details?.furnished_status && (<div className={styles.detailItem}><span className={styles.detailLabel}>Furnished</span><span className={styles.detailValue}>{property.property_details.furnished_status}</span></div>)}
                       {property.property_details?.council_tax_band && (<div className={styles.detailItem}><span className={styles.detailLabel}>Council Tax</span><span className={styles.detailValue}>Band {property.property_details.council_tax_band}</span></div>)}
                       {property.property_details?.epc_rating && (<div className={styles.detailItem}><span className={styles.detailLabel}>EPC Rating</span><span className={styles.detailValue}>{property.property_details.epc_rating}</span></div>)}
                       {property.property_details?.deposit_amount > 0 && (<div className={styles.detailItem}><span className={styles.detailLabel}>Deposit</span><span className={styles.detailValue}>£{property.property_details.deposit_amount.toLocaleString()}</span></div>)}
                    </div>
                  </div>
                </div>
             )}
             {activeTab === "floorplan" && floorPlanDocument && (<div className={styles.floorPlanContainer}><Image src={floorPlanDocument.document_url} alt="Floor Plan" width={800} height={600} className={styles.floorPlanImage} /></div>)}
          </div>
        </div>

        <div ref={sidebarRef} className={`${styles.sidebar} ${isSticky ? styles.sticky : ''}`}>
          <div className={styles.viewingCard}>
            <h3 className={styles.viewingTitle}>Request a Viewing</h3>
            <p className="text-sm text-gray-600">To request a viewing, please call us or send an email.</p>
            <div className="mt-4 space-y-2">
                <a href="tel:+447399301948" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                    <Phone size={16} className="text-primary-gold" />
                    <span>+44 7399 301948</span>
                </a>
                <a href="mailto:info@loveviewestate.co.uk" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                    <Mail size={16} className="text-primary-gold" />
                    <span>info@loveviewestate.co.uk</span>
                </a>
            </div>
          </div>
          <div className={styles.socialSharing}>
             <h3 className={styles.sectionTitle} style={{textAlign: 'center', fontSize: '1rem', marginBottom: '1rem'}}>Share Property</h3>
            <div className={styles.shareButtons}>
              <button className={styles.shareButton} onClick={() => handleShare("facebook")}><Facebook size={18} /></button>
              <button className={styles.shareButton} onClick={() => handleShare("twitter")}><Twitter size={18} /></button>
              <button className={styles.shareButton} onClick={() => handleShare("pinterest")}><Share2 size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

    
