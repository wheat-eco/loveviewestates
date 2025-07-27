
import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import nodemailer from "nodemailer"
import fs from "fs/promises"
import path from "path"

async function getEmailSettings() {
  return {
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
    EMAIL_DOMAIN: process.env.EMAIL_DOMAIN || 'loveviewestates.co.uk',
  }
}

async function renderTemplate(templateName: string, data: Record<string, any>) {
  try {
    const templatePath = path.join(process.cwd(), "src", "emails", templateName);
    let templateContent = await fs.readFile(templatePath, "utf-8");
    for (const key in data) {
      const regex = new RegExp(`{{{${key}}}}`, "g");
      templateContent = templateContent.replace(regex, data[key]);
    }
    return templateContent;
  } catch (error) {
    console.error(`Error rendering email template ${templateName}:`, error);
    return `Error rendering email template: ${templateName}`;
  }
}


export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const requestId = formData.get("requestId") as string
    const status = formData.get("status") as string
    const sendEmail = formData.get("sendEmail") === "true"
    const propertyTitle = formData.get("propertyTitle") as string
    const propertySlug = formData.get("propertySlug") as string

    if (!requestId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: viewingRequest, error: fetchError } = await supabase
      .from("viewing_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (fetchError) {
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 })
    }

    const { error } = await supabase.from("viewing_requests").update({ status }).eq("id", requestId)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const settings = await getEmailSettings();

    if (sendEmail && settings.EMAIL_HOST) {
        const transporter = nodemailer.createTransport({
            host: settings.EMAIL_HOST,
            port: Number(settings.EMAIL_PORT),
            secure: settings.EMAIL_SECURE,
            auth: {
              user: settings.EMAIL_USER,
              pass: settings.EMAIL_PASSWORD,
            },
        });
      try {
        const subject = status === 'confirmed' ? 'Your Viewing Request is Confirmed' : 'Update on Your Viewing Request';
        const body = status === 'confirmed' ? "<p style='color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 20px 0;'>One of our agents will contact you shortly to confirm the exact date and time for your viewing.</p>" : ""
        
        const html = await renderTemplate("viewing-status-update.html", {
          ...settings,
          subject,
          name: viewingRequest.name,
          property_title: propertyTitle,
          property_slug: propertySlug,
          status,
          body
        });
        
        const mailOptions = {
          from: settings.EMAIL_FROM,
          to: viewingRequest.email,
          subject: subject,
          html: html,
        }

        await transporter.sendMail(mailOptions);

      } catch (emailError) {
        console.error("Error sending email:", emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
