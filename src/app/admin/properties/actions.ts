"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteProperty(formData: FormData) {
  const propertyId = formData.get("property_id") as string

  if (!propertyId) {
    return { success: false, message: "Property ID is required" }
  }

  try {
    const supabase = await createClient()

    // Delete property
    const { error } = await supabase.from("properties").delete().eq("id", propertyId)

    if (error) {
      console.error("Error deleting property:", error)
      return { success: false, message: `Failed to delete property: ${error.message}` }
    }

    // Revalidate the page to refresh the data
    revalidatePath("/admin/properties")

    return { success: true, message: "Property deleted successfully" }
  } catch (error) {
    console.error("Error in deleteProperty:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
