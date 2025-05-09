import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { Resend } from "resend"
import ViewingStatusUpdateEmail from "@/emails/ViewingStatusUpdate"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

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

    // First, get the viewing request details for the email
    const { data: viewingRequest, error: fetchError } = await supabase
      .from("viewing_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (fetchError) {
      console.error("Error fetching viewing request:", fetchError)
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 })
    }

    // Update viewing request status
    const { error } = await supabase.from("viewing_requests").update({ status }).eq("id", requestId)

    if (error) {
      console.error("Error updating viewing request status:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Send email notification if requested
    if (sendEmail && process.env.RESEND_API_KEY) {
      try {
        const { error: emailError } = await resend.emails.send({
          from: `Love View Estate <noreply@${process.env.EMAIL_DOMAIN || "loveviewestates.co.uk"}>`,
          to: viewingRequest.email,
          subject: `Your Viewing Request Update`,
          react: ViewingStatusUpdateEmail({
            name: viewingRequest.name,
            propertyTitle: propertyTitle,
            propertySlug: propertySlug,
            status,
            preferredDate: viewingRequest.preferred_date,
            domain: process.env.EMAIL_DOMAIN || "loveviewestates.co.uk",
          }),
        })

        if (emailError) {
          console.error("Error sending email:", emailError)
          // Continue even if email fails
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError)
        // Continue even if email fails
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating viewing request status:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
