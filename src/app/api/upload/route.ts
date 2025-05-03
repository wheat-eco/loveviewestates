import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const formData = await request.formData();

    const propertyId = formData.get("property_id") as string;
    const fileType = formData.get("file_type") as string; // "image" or "document"
    const file = formData.get("file") as File;

    if (!propertyId || !fileType || !file) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
    const filePath =
      fileType === "image"
        ? `property-images/${fileName}`
        : `property-documents/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("properties")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { success: false, message: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("properties")
      .getPublicUrl(filePath);

    if (!publicUrlData) {
      return NextResponse.json(
        { success: false, message: "Failed to retrieve file URL" },
        { status: 500 }
      );
    }

    // Insert file details into the database
    if (fileType === "image") {
      const isFeatured = formData.get("is_featured") === "true";
      const displayOrder = parseInt(formData.get("display_order") as string, 10);

      const { error: imageError } = await supabase.from("property_images").insert({
        property_id: propertyId,
        image_url: publicUrlData.publicUrl,
        is_featured: isFeatured,
        display_order: displayOrder,
      });

      if (imageError) {
        console.error("Error inserting image record:", imageError);
        return NextResponse.json(
          { success: false, message: "Failed to save image details" },
          { status: 500 }
        );
      }
    } else if (fileType === "document") {
      const documentName = formData.get("document_name") as string;
      const documentType = formData.get("document_type") as string;

      const { error: docError } = await supabase.from("property_documents").insert({
        property_id: propertyId,
        document_name: documentName,
        document_url: publicUrlData.publicUrl,
        document_type: documentType,
      });

      if (docError) {
        console.error("Error inserting document record:", docError);
        return NextResponse.json(
          { success: false, message: "Failed to save document details" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      file_url: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}