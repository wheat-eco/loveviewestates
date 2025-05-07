"use server"

import { Resend } from "resend"
import { createServerSupabaseClient } from "@/utils/supabase/serve"

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
      // Send notification email to staff
      await resend.emails.send({
        from: "Love View Estate <contact@loveviewestates.co.uk>",
        to: ["admin@loveviewestate.com"], // Replace with your staff email
        subject: `New Contact Form Submission: ${subject || "General Inquiry"}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      })

      // Send confirmation email to user
      await resend.emails.send({
        from: "Love View Estate <contact@loveviewestates.co.uk>",
        to: [email],
        subject: "Thank you for contacting Love View Estate",
        html: `
          <h1>Thank you for contacting Love View Estate</h1>
          <p>Dear ${name},</p>
          <p>We have received your inquiry and a member of our team will be in touch with you shortly.</p>
          <p>For your reference, here's a copy of your message:</p>
          <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <p>Kind regards,</p>
          <p>The Love View Estate Team</p>
        `,
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
