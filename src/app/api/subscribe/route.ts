import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createServerSupabaseClient } from "@/utils/supabase/serve"
import SubscriptionConfirmationEmail from "@/emails/SubscriptionConfirmation"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address",
        },
        { status: 400 },
      )
    }

    // Connect to Supabase
    const supabase = await createServerSupabaseClient()

    // Check if already subscribed
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single()

    if (existingSubscriber) {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed to our newsletter!",
      })
    }

    // Save to database
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email,
      status: "ACTIVE",
      subscribed_at: new Date().toISOString(),
    })

    if (error) throw error

    // Send confirmation email
    await resend.emails.send({
      from: "Love View Estates <newsletter@loveviewestates.co.uk>",
      to: [email],
      subject: "Welcome to Love View Estates Newsletter",
      react: SubscriptionConfirmationEmail({
        email,
        domain: "loveviewestates.co.uk",
      }),
      text: `Thank you for subscribing to Love View Estates newsletter! You'll now receive updates on new properties, market insights, and exclusive offers. If you didn't subscribe, please ignore this email.`,
    })

    return NextResponse.json({
      success: true,
      message: "Subscription successful! Please check your email for confirmation.",
      redirectUrl: "/newsletter/thank-you",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to subscribe. Please try again.",
      },
      { status: 500 },
    )
  }
}
