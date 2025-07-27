
"use server"

import nodemailer from "nodemailer"
import { createClient } from "@/utils/supabase/server"
import fs from "fs/promises"
import path from "path"

async function renderTemplate(templateName: string, data: Record<string, any>) {
  try {
    const templatePath = path.join(process.cwd(), "src", "emails", templateName)
    let templateContent = await fs.readFile(templatePath, "utf-8")
    for (const key in data) {
      const regex = new RegExp(`{{{${key}}}}`, "g")
      templateContent = templateContent.replace(regex, data[key])
    }
    return templateContent
  } catch (error) {
    console.error(`Error rendering email template ${templateName}:`, error)
    // Return a basic fallback to ensure an email can still be sent
    return `There was an error rendering the email template. Please check the server logs. Raw data: ${JSON.stringify(data)}`
  }
}

export async function submitContactForm(prevState: any, formData: FormData) {
  const supabase = createClient()

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
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      phone: phone || null,
      subject: subject || "General Inquiry",
      message,
      status: "new",
    })

    if (error) {
      console.error("Supabase error:", error)
      throw new Error(`Database Error: ${error.message}`)
    }

    const settings = {
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        EMAIL_FROM: process.env.EMAIL_FROM,
        EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
        EMAIL_DOMAIN: process.env.EMAIL_DOMAIN || 'loveviewestates.co.uk',
        EMAIL_TO: process.env.EMAIL_TO
    }
    
    if (settings && settings.EMAIL_HOST && settings.EMAIL_TO) {
      const transporter = nodemailer.createTransport({
        host: settings.EMAIL_HOST,
        port: Number(settings.EMAIL_PORT),
        secure: settings.EMAIL_SECURE,
        auth: {
          user: settings.EMAIL_USER,
          pass: settings.EMAIL_PASSWORD,
        },
      })

      // Verify the connection and credentials
      await transporter.verify();

      const emailData = {
        ...settings,
        name,
        email,
        phone: phone || "Not provided",
        subject: subject || "General Inquiry",
        message,
      }

      try {
        // Send notification email to staff
        const adminHtml = await renderTemplate("contact-form-admin-notification.html", emailData)
        await transporter.sendMail({
          from: settings.EMAIL_FROM,
          to: settings.EMAIL_TO,
          subject: `New Contact Form Submission: ${emailData.subject}`,
          html: adminHtml,
        })

        // Send confirmation email to user
        const userHtml = await renderTemplate("contact-form-user-confirmation.html", emailData)
        await transporter.sendMail({
          from: settings.EMAIL_FROM,
          to: email,
          subject: "Thank you for contacting Love View Estates",
          html: userHtml,
        })
      } catch (emailError: any) {
        console.error("Email sending error after verification:", emailError)
        // This is now a more critical error because we know the connection was initially good.
        return {
          success: true,
          redirectUrl: "/contact/thank-you",
          warning: "Your message was saved, but the confirmation email could not be sent due to a delivery error.",
        }
      }
    }

    // Instead of using redirect(), return a success response with a redirect URL
    return {
      success: true,
      redirectUrl: "/contact/thank-you",
    }
  } catch (error: any) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      error: `There was a problem submitting your message. Please try again. Error: ${error.message}`,
    }
  }
}
