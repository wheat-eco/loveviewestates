"use client"

import { useState, useRef, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  MessageSquare,
  Clock,
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
  property_type: string
  property_category: string
  bedrooms: number
  bathrooms: number
  price: number
  available_date: string
  status: string
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
    property_id?: string
    created_at?: string
  }[]
}

interface PropertyDetailPageProps {
  property: Property
  area: string | null
  region: string | null
}

export default function PropertyDetailPageClient({ property, area, region }: PropertyDetailPageProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  // Sort images - featured first, then by display order
  const sortedImages = [...(property.property_images || [])].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1
    if (!a.is_featured && b.is_featured) return 1
    return (a.display_order || 0) - (b.display_order || 0)
  })

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const mainImageRef = useRef<HTMLImageElement>(null)

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Handle navigation
  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1))
  }

  // Format price based on property type
  const formatPrice = () => {
    const formattedPrice = property.price?.toLocaleString() || "0"
    return property.property_category === "rent" ? `£${formattedPrice} pcm` : `£${formattedPrice}`
  }

  // Get property status label
  const getStatusLabel = () => {
    if (property.status === "let_agreed") return "LET AGREED"
    if (property.status === "sale_agreed") return "SALE AGREED"
    if (property.status === "under_offer") return "UNDER OFFER"
    if (property.status === "sold") return "SOLD"
    return property.property_category === "rent" ? "TO LET" : "FOR SALE"
  }

  // Get EPC document
  const epcDocument = property.property_documents?.find((doc) => doc.document_type === "EPC")

  // Social sharing functions
  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(`${property.title} - Love View Estate`)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, "_blank")
  }

  const handleTwitterShare = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out this property: ${property.title} - Love View Estate`)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank")
  }

  const handlePinterestShare = () => {
    const url = encodeURIComponent(window.location.href)
    const description = encodeURIComponent(`${property.title} - Love View Estate`)
    const media = encodeURIComponent(sortedImages[0]?.image_url || "")
    window.open(
      `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`,
      "_blank",
    )
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError("")
    setFormSuccess("")

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch("/api/request-viewing", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setFormSuccess("Your viewing request has been submitted successfully. We'll contact you shortly.")
        form.reset()
      } else {
        setFormError(result.message || "Failed to submit your request. Please try again.")
      }
    } catch (error) {
      setFormError("An unexpected error occurred. Please try again later.")
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle fullscreen gallery
  const toggleGallery = () => {
    setIsGalleryOpen(!isGalleryOpen)
  }

  return (
    <div className={styles.propertyDetailContainer}>
      {/* Back button */}
      <div className={styles.backLink}>
        <Link href="/available-properties">
          <ArrowLeft size={16} />
          <span>Back to Properties</span>
        </Link>
      </div>

      {/* Property Title */}
      <h1 className={styles.propertyTitle}>{property.title}</h1>

      <p className={styles.propertyAddress}>
        <MapPin size={16} className={styles.iconGold} />
        {property.address}, {area || ""} {region ? `(${region})` : ""}
      </p>

      {/* Property Status */}
      {property.status && <div className={styles.statusBadge}>{getStatusLabel()}</div>}

      {/* Property Gallery */}
      <div className={styles.propertyGallery}>
        <div className={styles.mainImageContainer}>
          {sortedImages.length > 0 ? (
            <>
              <Image
                ref={mainImageRef}
                src={sortedImages[currentImageIndex]?.image_url || "/placeholder.svg?height=600&width=800"}
                alt={property.title}
                width={800}
                height={600}
                className={styles.mainImage}
                priority
              />
              <button className={styles.expandButton} onClick={toggleGallery}>
                <Maximize2 size={20} />
              </button>
              {sortedImages.length > 1 && (
                <>
                  <button className={`${styles.navArrow} ${styles.prevArrow}`} onClick={handlePrev}>
                    <ChevronLeft size={24} />
                  </button>
                  <button className={`${styles.navArrow} ${styles.nextArrow}`} onClick={handleNext}>
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className={styles.noImagePlaceholder}>
              <Home size={48} />
              <p>No images available</p>
            </div>
          )}
        </div>

        {sortedImages.length > 1 && (
          <div className={styles.thumbnailGrid}>
            {sortedImages.map((image, index) => (
              <div
                key={image.id}
                className={`${styles.thumbnailContainer} ${index === currentImageIndex ? styles.active : ""}`}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={image.image_url || "/placeholder.svg?height=100&width=100"}
                  alt={image.caption || `${property.title} - Image ${index + 1}`}
                  width={100}
                  height={75}
                  className={styles.thumbnail}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && (
        <div className={styles.galleryModal}>
          <div className={styles.galleryModalContent}>
            <button className={styles.closeGallery} onClick={toggleGallery}>
              &times;
            </button>

            <div className={styles.galleryMainImage}>
              <Image
                src={sortedImages[currentImageIndex]?.image_url || "/placeholder.svg?height=1200&width=1600"}
                alt={property.title}
                width={1600}
                height={1200}
                className={styles.fullscreenImage}
              />
            </div>

            <div className={styles.galleryControls}>
              <button className={styles.galleryNavButton} onClick={handlePrev}>
                <ChevronLeft size={24} />
              </button>
              <span className={styles.galleryCounter}>
                {currentImageIndex + 1} / {sortedImages.length}
              </span>
              <button className={styles.galleryNavButton} onClick={handleNext}>
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Details */}
      <div className={styles.propertyDetailsGrid}>
        <div className={styles.propertyMainInfo}>
          {/* Price */}
          <div className={styles.propertyPrice}>{formatPrice()}</div>

          {/* Key Details */}
          <div className={styles.keyDetails}>
            <div className={styles.keyDetail}>
              <Bed size={20} className={styles.detailIcon} />
              <span>
                {property.bedrooms} Bedroom{property.bedrooms !== 1 ? "s" : ""}
              </span>
            </div>

            <div className={styles.keyDetail}>
              <Bath size={20} className={styles.detailIcon} />
              <span>
                {property.bathrooms} Bathroom{property.bathrooms !== 1 ? "s" : ""}
              </span>
            </div>

            <div className={styles.keyDetail}>
              <Home size={20} className={styles.detailIcon} />
              <span>{property.property_type}</span>
            </div>

            <div className={styles.keyDetail}>
              <MapPin size={20} className={styles.detailIcon} />
              <span>{property.postcode}</span>
            </div>

            {property.available_date && (
              <div className={styles.keyDetail}>
                <Calendar size={20} className={styles.detailIcon} />
                <span>{new Date(property.available_date).toLocaleDateString("en-GB")}</span>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <div className={styles.descriptionContent}>
              {property.description ? (
                <p>{property.description}</p>
              ) : (
                <>
                  <p>
                    Love View Estate are delighted to present to the{" "}
                    {property.property_category === "rent" ? "rental" : "sales"} market this {property.bedrooms} bedroom{" "}
                    {property.property_type?.toLowerCase()} situated in the heart of {area || "Ayrshire"}{" "}
                    {region ? `(${region})` : ""}.
                  </p>
                  <p>
                    The property comprises of a secure entry and welcoming hallway with access to all rooms in the
                    property.
                  </p>
                  <p>
                    The property has been recently renovated to a high standard throughout, including a brand new modern
                    fitted kitchen, stylish {property.bathrooms} piece bathroom suite, brand new wood flooring
                    throughout and tasteful decor.
                  </p>
                  <p>
                    The property benefits from gas central heating, double glazing, communal garden area, easy on street
                    parking and located within walking distance to shops, supermarkets, schools, take away shops and
                    train/bus links.
                  </p>
                  <p>Contact Love View Estate for more details on this property or to arrange a viewing.</p>
                </>
              )}
            </div>

            {/* Property Features */}
            {property.property_features && property.property_features.length > 0 && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>Features</h2>
                <div className={styles.featuresGrid}>
                  {property.property_features.map((feature) => (
                    <div key={feature.id} className={styles.featureItem}>
                      <Check size={18} className={styles.detailIcon} />
                      <span>{feature.feature_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>Property Details</h2>
              <div className={styles.detailsGrid}>
                {property.property_details?.furnished_status && (
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Furnished Status</div>
                    <div className={styles.detailValue}>{property.property_details.furnished_status}</div>
                  </div>
                )}

                {property.property_details?.council_tax_band && (
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Council Tax Band</div>
                    <div className={styles.detailValue}>{property.property_details.council_tax_band}</div>
                  </div>
                )}

                {property.property_details?.epc_rating && (
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>EPC Rating</div>
                    <div className={styles.detailValue}>{property.property_details.epc_rating}</div>
                  </div>
                )}

                {property.property_details?.deposit_amount > 0 && (
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Deposit</div>
                    <div className={styles.detailValue}>
                      £{property.property_details.deposit_amount.toLocaleString()}
                    </div>
                  </div>
                )}

                {property.property_details?.pets_policy && (
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Pets Policy</div>
                    <div className={styles.detailValue}>{property.property_details.pets_policy}</div>
                  </div>
                )}

                {property.property_details?.smoking_policy && (
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Smoking Policy</div>
                    <div className={styles.detailValue}>{property.property_details.smoking_policy}</div>
                  </div>
                )}
              </div>
            </div>

            {/* EPC Section */}
            {epcDocument && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>EPC</h2>
                <a
                  href={epcDocument.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.documentLink}
                >
                  <FileText size={18} className={styles.documentIcon} />
                  <span>View EPC Document</span>
                </a>
              </div>
            )}

            {/* Social Sharing */}
            <div className={styles.socialSharing}>
              <h3>Share this property</h3>
              <div className={styles.shareButtons}>
                <button className={styles.shareButton} onClick={handleFacebookShare}>
                  <Facebook size={18} />
                  <span>Facebook</span>
                </button>
                <button className={styles.shareButton} onClick={handleTwitterShare}>
                  <Twitter size={18} />
                  <span>Twitter</span>
                </button>
                <button className={styles.shareButton} onClick={handlePinterestShare}>
                  <Share2 size={18} />
                  <span>Pinterest</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Request a Viewing Section */}
        <div className={styles.viewingRequestSection}>
          <div className={styles.viewingCard}>
            <h2 className={styles.viewingTitle}>Request a Viewing</h2>
            <p className={styles.viewingSubtitle}>Fill in the form below to request a viewing of this property</p>

            {formSuccess && (
              <div className={styles.successMessage}>
                <Check size={18} />
                {formSuccess}
              </div>
            )}

            {formError && (
              <div className={styles.errorMessage}>
                <Info size={18} />
                {formError}
              </div>
            )}

            <form className={styles.viewingForm} onSubmit={handleSubmit}>
              <input type="hidden" name="property_id" value={property.id} />
              <input type="hidden" name="property_type" value={property.property_category} />

              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <div className={styles.inputWithIcon}>
                  <User size={18} className={styles.inputIcon} />
                  <input type="text" id="name" name="name" required placeholder="Your full name" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Telephone</label>
                <div className={styles.inputWithIcon}>
                  <Phone size={18} className={styles.inputIcon} />
                  <input type="tel" id="phone" name="phone" required placeholder="Your phone number" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <div className={styles.inputWithIcon}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input type="email" id="email" name="email" required placeholder="Your email address" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferred_date">Preferred Date (Optional)</label>
                <div className={styles.inputWithIcon}>
                  <Calendar size={18} className={styles.inputIcon} />
                  <input type="date" id="preferred_date" name="preferred_date" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferred_time">Preferred Time (Optional)</label>
                <div className={styles.inputWithIcon}>
                  <Clock size={18} className={styles.inputIcon} />
                  <select id="preferred_time" name="preferred_time">
                    <option value="">Select a time</option>
                    <option value="morning">Morning (9am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 5pm)</option>
                    <option value="evening">Evening (5pm - 8pm)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Request Message</label>
                <div className={styles.inputWithIcon}>
                  <MessageSquare size={18} className={styles.inputIcon} />
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    defaultValue={`Please may I book a viewing of this property "${property.title}" - Ref: ${property.slug}`}
                    placeholder="Add any additional information about your viewing request"
                  ></textarea>
                </div>
              </div>

              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Request Viewing"}
              </button>
            </form>

            <div className={styles.contactAlternative}>
              <p>Alternatively, call us directly:</p>
              <a href="tel:+441234567890" className={styles.phoneLink}>
                <Phone size={18} />
                01234 567 890
              </a>
            </div>
          </div>

          <div className={styles.agentCard}>
            <div className={styles.agentInfo}>
              <div className={styles.agentImage}>
                <Image
                  src="/placeholder.svg?height=100&width=100&text=Agent"
                  alt="Estate Agent"
                  width={80}
                  height={80}
                />
              </div>
              <div>
                <h3>Love View Estate</h3>
                <p>Your trusted property partner</p>
              </div>
            </div>
            <div className={styles.agentContact}>
              <a href="tel:+441234567890" className={styles.agentButton}>
                <Phone size={18} />
                Call
              </a>
              <a href="mailto:info@loveviewestate.com" className={styles.agentButton}>
                <Mail size={18} />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
