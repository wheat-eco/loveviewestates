import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { Resend } from "resend"
import ValuationStatusUpdateEmail from "@/emails/ValuationStatusUpdate"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const requestId = formData.get("requestId") as string
    const status = formData.get("status") as string
    const sendEmail = formData.get("sendEmail") === "true"

    if (!requestId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // First, get the valuation request details for the email
    const { data: valuationRequest, error: fetchError } = await supabase
      .from("valuation_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (fetchError) {
      console.error("Error fetching valuation request:", fetchError)
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 })
    }

    // Update valuation request status
    const { error } = await supabase.from("valuation_requests").update({ status }).eq("id", requestId)

    if (error) {
      console.error("Error updating valuation request status:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Send email notification if requested
    if (sendEmail && process.env.RESEND_API_KEY) {
      try {
        const { error: emailError } = await resend.emails.send({
          from: `Love View Estate <noreply@${process.env.EMAIL_DOMAIN || "loveviewestates.co.uk"}>`,
          to: valuationRequest.email,
          subject: `Your Valuation Request Update`,
          react: ValuationStatusUpdateEmail({
            name: valuationRequest.full_name,
            address: valuationRequest.postcode, // Using postcode as the address
            status,
            requestType: valuationRequest.valuation_type === "sales" ? "Sales" : "Rental",
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
    console.error("Error updating valuation request status:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
