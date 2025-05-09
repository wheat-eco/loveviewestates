"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/utils/supabase/serve"
import { Resend } from "resend"
import ValuationStatusUpdateEmail from "@/emails/ValuationStatusUpdate"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export async function updateValuationRequestStatus(formData: FormData) {
  try {
    const requestId = formData.get("requestId") as string
    const status = formData.get("status") as string
    const sendEmail = formData.get("sendEmail") === "true"

    if (!requestId || !status) {
      return { success: false, error: "Missing required fields" }
    }

    const supabase = await createServerSupabaseClient()

    // First, get the valuation request details for the email
    const { data: request, error: fetchError } = await supabase
      .from("valuation_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (fetchError) {
      console.error("Error fetching valuation request:", fetchError)
      return { success: false, error: fetchError.message }
    }

    // Update valuation request status
    const { error } = await supabase.from("valuation_requests").update({ status }).eq("id", requestId)

    if (error) {
      console.error("Error updating valuation request status:", error)
      return { success: false, error: error.message }
    }

    // Send email notification if requested
    if (sendEmail && process.env.RESEND_API_KEY) {
      try {
        const { error: emailError } = await resend.emails.send({
          from: `Love View Estate <noreply@${process.env.EMAIL_DOMAIN || "loveviewestates.co.uk"}>`,
          to: request.email,
          subject: `Your Valuation Request Update`,
          react: ValuationStatusUpdateEmail({
            name: request.full_name,
            address: request.postcode, // Using postcode as the address
            status,
            requestType: request.valuation_type === "sales" ? "Sales" : "Rental",
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

    // Revalidate the valuation requests page
    revalidatePath("/admin/valuation-requests")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating valuation request status:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteValuationRequest(formData: FormData) {
  try {
    const requestId = formData.get("requestId") as string

    if (!requestId) {
      return { success: false, error: "Missing request ID" }
    }

    const supabase = await createServerSupabaseClient()

    // Delete valuation request
    const { error } = await supabase.from("valuation_requests").delete().eq("id", requestId)

    if (error) {
      console.error("Error deleting valuation request:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the valuation requests page
    revalidatePath("/admin/valuation-requests")

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting valuation request:", error)
    return { success: false, error: error.message }
  }
}
