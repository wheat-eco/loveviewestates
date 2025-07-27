
'use server'

import nodemailer from "nodemailer"
import fs from "fs/promises"
import path from "path"

export async function fetchSettings() {
    // This action reads directly from process.env, which is populated from your .env file on server start.
    return {
        EMAIL_HOST: process.env.EMAIL_HOST || "",
        EMAIL_PORT: process.env.EMAIL_PORT || "",
        EMAIL_USER: process.env.EMAIL_USER || "",
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
        EMAIL_FROM: process.env.EMAIL_FROM || "",
        EMAIL_SECURE: process.env.EMAIL_SECURE || "true",
        EMAIL_TO: process.env.EMAIL_TO || "",
        EMAIL_DOMAIN: process.env.EMAIL_DOMAIN || ""
    };
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

export async function sendTestEmail() {
  const settings = {
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
    EMAIL_TO: process.env.EMAIL_TO,
    EMAIL_DOMAIN: process.env.EMAIL_DOMAIN || 'loveviewestates.co.uk'
  }

  if (!settings.EMAIL_HOST || !settings.EMAIL_TO) {
    throw new Error("Email Host and Admin 'To' Email must be configured in your .env file.")
  }
  
  const transporter = nodemailer.createTransport({
    host: settings.EMAIL_HOST,
    port: Number(settings.EMAIL_PORT),
    secure: settings.EMAIL_SECURE,
    auth: {
      user: settings.EMAIL_USER,
      pass: settings.EMAIL_PASSWORD,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
  })

  try {
    await transporter.verify();
    
    const html = await renderTemplate("test-email.html", settings);
    
    await transporter.sendMail({
      from: settings.EMAIL_FROM,
      to: settings.EMAIL_TO,
      subject: "Test Email from Love View Estate",
      html: html
    })
  } catch (error: any) {
    console.error("Failed to send test email:", error)
    throw new Error(`Failed to send test email. Reason: ${error.message}`)
  }
}
