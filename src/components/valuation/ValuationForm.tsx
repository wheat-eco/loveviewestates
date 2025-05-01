"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import styles from "@/app/valuation/valuation.module.css"

interface ValuationFormProps {
  valuationType: "sale" | "rental"
}

export default function ValuationForm({ valuationType }: ValuationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddressLoading, setIsAddressLoading] = useState(false)
  const [formData, setFormData] = useState({
    postcode: "",
    bedrooms: "1",
    property_type: "Flats",
    full_name: "",
    email: "",
    phone: "",
    move_date: "",
    marketing_consent: false,
    terms_consent: false,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))

    // Clear error when checkbox is changed
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const findAddress = async () => {
    if (!formData.postcode) {
      setFormErrors((prev) => ({ ...prev, postcode: "Please enter a postcode" }))
      return
    }

    setIsAddressLoading(true)
    try {
      // Using postcodes.io API to validate the postcode
      const response = await fetch(`https://api.postcodes.io/postcodes/${formData.postcode}/validate`)
      const data = await response.json()

      if (!data.result) {
        setFormErrors((prev) => ({ ...prev, postcode: "Invalid postcode" }))
      } else {
        // If we had address fields, we would populate them here
        // For now, just show a success message
        alert("Postcode validated successfully!")
      }
    } catch (error) {
      console.error("Error validating postcode:", error)
      setFormErrors((prev) => ({ ...prev, postcode: "Error validating postcode" }))
    } finally {
      setIsAddressLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Required fields validation
    if (!formData.postcode) errors.postcode = "Postcode is required"
    if (!formData.full_name) errors.full_name = "Full name is required"
    if (!formData.email) errors.email = "Email is required"
    if (!formData.phone) errors.phone = "Phone number is required"
    if (!formData.move_date) errors.move_date = "Please select when you plan to move"

    // Email format validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Consent validation
    if (!formData.marketing_consent) errors.marketing_consent = "Please provide marketing consent"
    if (!formData.terms_consent) errors.terms_consent = "Please accept the terms and privacy policy"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/valuation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          valuation_type: valuationType,
        }),
      })

      if (response.ok) {
        router.push("/valuation/thank-you")
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Failed to submit valuation request"}`)
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An unexpected error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.valuationFormSection}>
      <div className={styles.valuationContainer}>
        <div className={styles.valuationFormWrapper}>
          <div className={styles.valuationFormLeft}>
            <h2>What's my property worth?</h2>
            <form className={styles.valuationForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="postcode">
                  Post Code<span className={styles.required}>*</span>:
                </label>
                <div className={styles.postcodeInputGroup}>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    placeholder="e.g. KW1 1AB"
                    required
                    value={formData.postcode}
                    onChange={handleChange}
                    className={formErrors.postcode ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    className={styles.findAddressBtn}
                    onClick={findAddress}
                    disabled={isAddressLoading}
                  >
                    {isAddressLoading ? "Loading..." : "Find Address"}
                  </button>
                </div>
                {formErrors.postcode && <p className="text-red-500 text-sm mt-1">{formErrors.postcode}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bedrooms">
                  Bedrooms<span className={styles.required}>*</span>:
                </label>
                <select id="bedrooms" name="bedrooms" required value={formData.bedrooms} onChange={handleChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="property_type">
                  Property Type<span className={styles.required}>*</span>:
                </label>
                <select
                  id="property_type"
                  name="property_type"
                  required
                  value={formData.property_type}
                  onChange={handleChange}
                >
                  <option value="Flats">Flats</option>
                  <option value="Terraced">Terraced</option>
                  <option value="Semi-Detached">Semi-Detached</option>
                  <option value="Detached">Detached</option>
                  <option value="Bungalow">Bungalow</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="full_name">
                  Full Name<span className={styles.required}>*</span>:
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  placeholder="Your full name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className={formErrors.full_name ? "border-red-500" : ""}
                />
                {formErrors.full_name && <p className="text-red-500 text-sm mt-1">{formErrors.full_name}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email<span className={styles.required}>*</span>:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">
                  Phone<span className={styles.required}>*</span>:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="move_date">
                  When do you plan to move?<span className={styles.required}>*</span>:
                </label>
                <select
                  id="move_date"
                  name="move_date"
                  required
                  value={formData.move_date}
                  onChange={handleChange}
                  className={formErrors.move_date ? "border-red-500" : ""}
                >
                  <option value="">Please Select</option>
                  <option value="0-3 months">0-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="1+ year">1+ year</option>
                  <option value="Just curious">Just curious</option>
                </select>
                {formErrors.move_date && <p className="text-red-500 text-sm mt-1">{formErrors.move_date}</p>}
              </div>

              <div className={styles.formGroup}>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="marketing_consent"
                    checked={formData.marketing_consent}
                    onCheckedChange={(checked: boolean) => handleCheckboxChange("marketing_consent", checked === true)}
                    className={formErrors.marketing_consent ? "border-red-500" : ""}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="marketing_consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Please tick this box if you are happy to be contacted by us for a FREE bespoke valuation of your
                      property and relevant services. You may withdraw your consent to our processing your personal data
                      for marketing purposes at any time, you may do this by emailing us at info@loveviewestate.com
                    </label>
                    {formErrors.marketing_consent && (
                      <p className="text-red-500 text-sm">{formErrors.marketing_consent}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms_consent"
                    checked={formData.terms_consent}
                    onCheckedChange={(checked: boolean) => handleCheckboxChange("terms_consent", checked === true)}
                    className={formErrors.terms_consent ? "border-red-500" : ""}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms_consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Please tick this box if you have read and accept our{" "}
                      <Link href="/terms-of-service" className="text-primary-gold hover:underline">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy-policy" className="text-primary-gold hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </label>
                    {formErrors.terms_consent && <p className="text-red-500 text-sm">{formErrors.terms_consent}</p>}
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <Link href="/valuation" className={styles.btnSecondary}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Link>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Next"}
                </button>
              </div>
            </form>
          </div>

          <div className={styles.valuationFormRight}>
            <h2>What happens next?</h2>
            <ul className={styles.nextSteps}>
              <li>
                <CheckCircle size={24} />
                <span>Secure a bespoke valuation of your home</span>
              </li>
              <li>
                <CheckCircle size={24} />
                <span>Use local experts unique market knowledge</span>
              </li>
              <li>
                <CheckCircle size={24} />
                <span>
                  Find out how to maximise your property's {valuationType === "sale" ? "sales" : "rental"} potential
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
