"use server"

import { Resend } from "resend"
import { createServerSupabaseClient } from "@/utils/supabase/serve"
import ContactNotificationEmail from "@/emails/ContactNotification"
import ContactConfirmationEmail from "@/emails/ContactConfirmation"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContactForm(formData: FormData) {
  // Use the updated async Supabase client
  const supabase = await createServerSupabaseClient()

  // Extract form data
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  // Basic validation
  if (!name || !email || !message) {
    return {
      success: false,
      error: "Please fill in all required fields",
    }
  }

  try {
    // Insert into contact_messages table
    const { error, data } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        phone: phone || null,
        subject: subject || "General Inquiry",
        message,
        status: "NEW",
      })
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    // Only send emails if database insertion was successful
    try {
      // Create plain text versions of emails
      const staffPlainText = `
New Contact Form Submission

From: ${name} (${email})
Phone: ${phone || "Not provided"}
Subject: ${subject || "General Inquiry"}

Message:
${message}

---
This is an automated notification from your website contact form.
Love View Estates | https://loveviewestates.co.uk
      `.trim()

      const userPlainText = `
Thank You For Contacting Us

Dear ${name},

Thank you for reaching out to Love View Estates. We have received your inquiry and a member of our team will be in touch with you shortly.

We aim to respond to all inquiries within 24 hours during business days.

Your Message:
Subject: ${subject || "General Inquiry"}
${message}

Browse Our Properties: https://loveviewestates.co.uk/available-properties

Kind regards,
The Love View Estates Team

Phone: 01234 567890 | Email: info@loveviewestates.co.uk
Address: 123 Property Street, Ayrshire, Scotland, UK
Website: https://loveviewestates.co.uk
      `.trim()

      // Send notification email to staff using React Email template
      await resend.emails.send({
        from: "Love View Estates <contact@loveviewestates.co.uk>",
        to: ["admin@loveviewestates.co.uk"], // Update with your actual admin email
        subject: `New Contact Form Submission: ${subject || "General Inquiry"}`,
        react: ContactNotificationEmail({
          name,
          email,
          phone: phone || undefined,
          subject: subject || undefined,
          message,
          domain: "loveviewestates.co.uk",
        }),
        text: staffPlainText, // Add plain text version
      })

      // Send confirmation email to user using React Email template
      await resend.emails.send({
        from: "Love View Estates <contact@loveviewestates.co.uk>",
        to: [email],
        subject: "Thank you for contacting Love View Estates",
        react: ContactConfirmationEmail({
          name,
          subject: subject || undefined,
          message,
          domain: "loveviewestates.co.uk",
        }),
        text: userPlainText, // Add plain text version
      })
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Continue even if email fails
    }

    // Instead of using redirect(), return a success response with a redirect URL
    return {
      success: true,
      redirectUrl: "/contact/thank-you",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      error: "There was a problem submitting your message. Please try again.",
    }
  }
}
