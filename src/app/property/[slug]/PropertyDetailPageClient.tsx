"use client"
import Image from "next/image"
import Link from "next/link"
import styles from "./property-detail.module.css"
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
} from "lucide-react"
import { notFound } from "next/navigation"
import { useState, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"

// Update the Property interface to match the one in page.tsx
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
  if (!property) {
    notFound()
  }

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Sort images - featured first, then by display order
  const sortedImages = [...property.property_images].sort((a, b) => {
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
    const formattedPrice = property.price.toLocaleString()
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
      <h1 className={styles.propertyTitle}>
        {property.address}, {area || ""} {region ? `(${region})` : ""}
      </h1>

      {/* Property Status */}
      {property.status && <div className={styles.statusBadge}>{getStatusLabel()}</div>}

      {/* Property Gallery */}
      <div className={styles.propertyGallery}>
        <div className={styles.mainImageContainer}>
          {sortedImages.length > 0 && (
            <Image
              ref={mainImageRef}
              src={sortedImages[currentImageIndex]?.image_url || "/placeholder.svg?height=600&width=800"}
              alt={property.title}
              width={800}
              height={600}
              className={styles.mainImage}
              priority
            />
          )}
        </div>

        {sortedImages.length > 1 && (
          <div className={styles.thumbnailControls}>
            <button className={styles.navButton} onClick={handlePrev}>
              <ArrowLeft size={16} />
              <span>Prev</span>
            </button>

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

            <button className={styles.navButton} onClick={handleNext}>
              <span>Next</span>
              <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className={styles.propertyDetails}>
        <div className={styles.propertyInfo}>
          {/* Price */}
          <div className={styles.propertyPrice}>{formatPrice()}</div>

          {/* Key Details */}
          <div className={styles.keyDetails}>
            <div className={styles.keyDetail}>
              <MapPin size={18} className={styles.detailIcon} />
              <span>
                {area || ""} {region ? `(${region})` : ""}
              </span>
            </div>

            <div className={styles.keyDetail}>
              <Bed size={18} className={styles.detailIcon} />
              <span>
                {property.bedrooms} Bedroom{property.bedrooms !== 1 ? "s" : ""}
              </span>
            </div>

            <div className={styles.keyDetail}>
              <Bath size={18} className={styles.detailIcon} />
              <span>
                {property.bathrooms} Bathroom{property.bathrooms !== 1 ? "s" : ""}
              </span>
            </div>

            <div className={styles.keyDetail}>
              <Home size={18} className={styles.detailIcon} />
              <span>{property.property_type}</span>
            </div>

            <div className={styles.keyDetail}>
              <MapPin size={18} className={styles.detailIcon} />
              <span>{property.postcode}</span>
            </div>

            {property.available_date && (
              <div className={styles.keyDetail}>
                <Calendar size={18} className={styles.detailIcon} />
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
                    {property.property_type.toLowerCase()} situated in the heart of {area || "north-ayrshire"}{" "}
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
                <div className={styles.keyDetails}>
                  {property.property_features.map((feature) => (
                    <div key={feature.id} className={styles.keyDetail}>
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
              <div className={styles.keyDetails}>
                {property.property_details?.furnished_status && (
                  <div className={styles.keyDetail}>
                    <Info size={18} className={styles.detailIcon} />
                    <span>Furnished: {property.property_details.furnished_status}</span>
                  </div>
                )}

                {property.property_details?.council_tax_band && (
                  <div className={styles.keyDetail}>
                    <Info size={18} className={styles.detailIcon} />
                    <span>Council Tax Band: {property.property_details.council_tax_band}</span>
                  </div>
                )}

                {property.property_details?.epc_rating && (
                  <div className={styles.keyDetail}>
                    <Info size={18} className={styles.detailIcon} />
                    <span>EPC Rating: {property.property_details.epc_rating}</span>
                  </div>
                )}

                {property.property_details?.deposit_amount > 0 && (
                  <div className={styles.keyDetail}>
                    <Info size={18} className={styles.detailIcon} />
                    <span>Deposit: £{property.property_details.deposit_amount.toLocaleString()}</span>
                  </div>
                )}

                {property.property_details?.pets_policy && (
                  <div className={styles.keyDetail}>
                    <Info size={18} className={styles.detailIcon} />
                    <span>Pets: {property.property_details.pets_policy}</span>
                  </div>
                )}

                {property.property_details?.smoking_policy && (
                  <div className={styles.keyDetail}>
                    <Info size={18} className={styles.detailIcon} />
                    <span>Smoking: {property.property_details.smoking_policy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* EPC Section */}
            {epcDocument && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>EPC</h2>
                <a href={epcDocument.document_url} target="_blank" rel="noopener noreferrer" className={styles.epcLink}>
                  <FileText size={18} />
                  <span>View EPC Document</span>
                </a>
              </div>
            )}

            {/* Social Sharing */}
            <div className={styles.socialSharing}>
              <button className={styles.shareButton} onClick={handleFacebookShare}>
                <Facebook size={16} />
                <span>Share</span>
              </button>
              <button className={styles.shareButton} onClick={handleTwitterShare}>
                <Twitter size={16} />
                <span>Tweet</span>
              </button>
              <button className={styles.shareButton} onClick={handlePinterestShare}>
                <Share2 size={16} />
                <span>Pin It</span>
              </button>
            </div>
          </div>
        </div>

        {/* Request a Viewing Section */}
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>Request a Viewing</h2>

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
              <label>Full Name</label>
              <div className={styles.inputWithIcon}>
                <input type="text" name="name" required placeholder="Your full name" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Telephone</label>
              <div className={styles.inputWithIcon}>
                <input type="tel" name="phone" required placeholder="Your phone number" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email Address</label>
              <div className={styles.inputWithIcon}>
                <input type="email" name="email" required placeholder="Your email address" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Preferred Date (Optional)</label>
              <div className={styles.inputWithIcon}>
                <input type="date" name="preferred_date" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Request Message</label>
              <div className={styles.inputWithIcon}>
                <textarea
                  name="message"
                  rows={5}
                  defaultValue={`Please may I book a viewing of this property "${property.title}" - Ref: ${property.slug}`}
                  placeholder="Add any additional information about your viewing request"
                ></textarea>
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Request Viewing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
