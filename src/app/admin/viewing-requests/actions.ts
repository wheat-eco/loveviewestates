"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateRequestStatus(formData: FormData) {
  const requestId = formData.get("request_id") as string
  const status = formData.get("status") as string

  if (!requestId || !status) {
    return { success: false, message: "Request ID and status are required" }
  }

  try {
    const supabase = await createClient()

    // Update request status
    const { error } = await supabase.from("viewing_requests").update({ status }).eq("id", requestId)

    if (error) {
      console.error("Error updating request status:", error)
      return { success: false, message: `Failed to update request: ${error.message}` }
    }

    // Revalidate the page to refresh the data
    revalidatePath("/admin/viewing-requests")

    return { success: true, message: "Request updated successfully" }
  } catch (error) {
    console.error("Error in updateRequestStatus:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function deleteRequest(formData: FormData) {
  const requestId = formData.get("request_id") as string

  if (!requestId) {
    return { success: false, message: "Request ID is required" }
  }

  try {
    const supabase = await createClient()

    // Delete request
    const { error } = await supabase.from("viewing_requests").delete().eq("id", requestId)

    if (error) {
      console.error("Error deleting request:", error)
      return { success: false, message: `Failed to delete request: ${error.message}` }
    }

    // Revalidate the page to refresh the data
    revalidatePath("/admin/viewing-requests")

    return { success: true, message: "Request deleted successfully" }
  } catch (error) {
    console.error("Error in deleteRequest:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
