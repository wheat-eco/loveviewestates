
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import fs from "fs/promises"
import path from "path"

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
  let email: string
  try {
    const formData = await request.formData()
    email = formData.get("email") as string

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Please provide a valid email address." }, { status: 400 })
    }
  } catch (error) {
    console.error("[SUBSCRIBE_API] Error parsing form data:", error)
    return NextResponse.json({ success: false, message: "Invalid request format." }, { status: 400 })
  }

  try {
    const settings = {
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        EMAIL_FROM: process.env.EMAIL_FROM,
        EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
        EMAIL_DOMAIN: process.env.EMAIL_DOMAIN || 'loveviewestates.co.uk'
    }

    if (!settings.EMAIL_HOST || !settings.EMAIL_USER || !settings.EMAIL_PASSWORD || !settings.EMAIL_FROM) {
      console.warn("[SUBSCRIBE_API] Email settings not configured in .env file. Skipping confirmation email.")
      return NextResponse.json({
        success: true,
        message: "Subscription recorded, but confirmation email could not be sent (admin setup needed).",
        redirectUrl: "/newsletter/thank-you",
      })
    }

    const transporter = nodemailer.createTransport({
      host: settings.EMAIL_HOST,
      port: Number(settings.EMAIL_PORT),
      secure: settings.EMAIL_SECURE,
      auth: {
        user: settings.EMAIL_USER,
        pass: settings.EMAIL_PASSWORD,
      },
    })
    
    // Verify connection
    await transporter.verify();

    const html = await renderTemplate("newsletter-subscription-confirmation.html", {
      ...settings,
      email,
    });

    await transporter.sendMail({
      from: settings.EMAIL_FROM,
      to: email,
      subject: "Welcome to Love View Estates Newsletter",
      html: html,
    })

    return NextResponse.json({
      success: true,
      message: "Subscription successful! Please check your email for confirmation.",
      redirectUrl: "/newsletter/thank-you",
    })
  } catch (error: any) {
    console.error("[SUBSCRIBE_API] Error:", error)
    return NextResponse.json({ success: false, message: `Failed to subscribe: ${error.message}` }, { status: 500 })
  }
}
