
'use server'

import { createClient } from "@/utils/supabase/server"
import { createServiceRoleClient } from "@/utils/supabase/service-role"
import { revalidatePath } from "next/cache"
import { type NextRequest } from 'next/server';
import type { PropertyImage } from "@/lib/supabase-client";

// Helper to generate a unique slug
const generateSlug = async (supabase: any, title: string, propertyId: number | null = null): Promise<string> => {
    let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let slug = baseSlug;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
        let query = supabase.from("properties").select("id").eq("slug", slug);
        if (propertyId) {
            query = query.not("id", "eq", propertyId);
        }
        const { data: existingSlug, error } = await query.maybeSingle();

        if (error) {
            console.error("Error checking slug uniqueness:", error);
            return `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`; // Fallback
        }

        if (!existingSlug) {
            isUnique = true;
        } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }
    return slug;
};

const getPropertyDataFromForm = (formData: FormData) => {
  const features = JSON.parse(formData.get("features") as string || "[]") as string[];
  const keywords = JSON.parse(formData.get("keywords") as string || "[]") as string[];
  
  return {
    basicDetails: {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category_id: Number(formData.get("category_id")),
      property_type_id: Number(formData.get("property_type_id")),
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      reception_rooms: Number(formData.get("reception_rooms") || 0),
      price: Number(formData.get("price")),
      price_qualifier: formData.get("price_qualifier") as string || null,
      rent_frequency: formData.get("rent_frequency") as string || "monthly",
      status: formData.get("status") as string,
      available_date: formData.get("available_date") as string || null,
      featured: formData.get("featured") === "true",
      meta_title: formData.get("meta_title") as string || null,
      meta_description: formData.get("meta_description") as string || null,
    },
    locationDetails: {
      area_id: Number(formData.get("area_id")),
      address: formData.get("address") as string,
      postcode: formData.get("postcode") as string,
      latitude: Number(formData.get("latitude") || null),
      longitude: Number(formData.get("longitude") || null),
    },
    propertySpecificDetails: {
        furnished_status: formData.get("furnished_status") as string || null,
        deposit_amount: Number(formData.get("deposit_amount") || null),
        pets_policy: formData.get("pets_policy") as string || null,
        smoking_policy: formData.get("smoking_policy") as string || null,
        minimum_tenancy: Number(formData.get("minimum_tenancy") || null),
        maximum_tenancy: Number(formData.get("maximum_tenancy") || null),
        tenure: formData.get("tenure") as string || null,
        lease_remaining: Number(formData.get("lease_remaining") || null),
        service_charge: Number(formData.get("service_charge") || null),
        ground_rent: Number(formData.get("ground_rent") || null),
        epc_rating: formData.get("epc_rating") as string || null,
        council_tax_band: formData.get("council_tax_band") as string || null,
        year_built: Number(formData.get("year_built") || null),
    },
    features,
    keywords,
    image_order: JSON.parse(formData.get("image_order") as string || "[]") as any[],
  };
}

async function uploadAndLinkFiles(supabase: any, formData: FormData, propertyId: number) {
    const uploadPromises = [];
    const newImageFiles: File[] = [];

    // Separate new files from form data
    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            if (key.startsWith('image_')) {
                newImageFiles.push(value);
            }
        }
    }
    
    // Upload new images and get their URLs
    const newImageUploads = newImageFiles.map(file => {
        const filePath = `property-images/${propertyId}/${Date.now()}-${file.name}`;
        return supabase.storage.from('properties').upload(filePath, file).then((uploadResult: { data: any, error: any }) => {
            if (uploadResult.error) throw uploadResult.error;
            const { data: urlData } = supabase.storage.from('properties').getPublicUrl(filePath);
            return {
                originalName: file.name,
                url: urlData.publicUrl,
            };
        });
    });

    const uploadedImages = await Promise.all(newImageUploads);
    const uploadedImageMap = new Map(uploadedImages.map(img => [img.originalName, img.url]));
    
    // Process image order from form data
    const imageOrder = JSON.parse(formData.get("image_order") as string || "[]");
    
    // Prepare records for property_images table
    const imageRecords: Omit<PropertyImage, 'id' | 'created_at'>[] = imageOrder.map((imgInfo: any, index: number) => {
        if (imgInfo.id) { // Existing image
            return {
                id: imgInfo.id,
                is_featured: imgInfo.is_featured || false,
                display_order: index,
            };
        } else { // New image
            const imageUrl = uploadedImageMap.get(imgInfo.name);
            if (!imageUrl) return null;
            return {
                property_id: propertyId,
                image_url: imageUrl,
                is_featured: imgInfo.is_featured || false,
                display_order: index,
                alt_text: imgInfo.name,
                image_type: 'property'
            };
        }
    }).filter(Boolean);

    // Update existing and insert new images
    const updates = imageRecords.filter(r => r.id).map(r => supabase.from('property_images').update({ display_order: r.display_order, is_featured: r.is_featured }).eq('id', r.id));
    const inserts = imageRecords.filter(r => !r.id);

    if (inserts.length > 0) {
        updates.push(supabase.from('property_images').insert(inserts.map(({ id, ...rest }) => rest)));
    }

    await Promise.all(updates);

    // Handle documents
    for (const [key, value] of formData.entries()) {
        if (value instanceof File && !key.startsWith('image_')) {
            const file = value;
            const filePath = `property-documents/${propertyId}/${Date.now()}-${file.name}`;
            const uploadPromise = supabase.storage.from('properties').upload(filePath, file)
                .then(async (uploadResult: { data: any, error: any }) => {
                    if (uploadResult.error) throw uploadResult.error;
                    const { data: urlData } = supabase.storage.from('properties').getPublicUrl(filePath);
                    await supabase.from('property_documents').upsert({
                        property_id: propertyId,
                        document_name: key,
                        document_type: key.toUpperCase(),
                        document_url: urlData.publicUrl,
                        file_size: file.size,
                        mime_type: file.type,
                    }, { onConflict: 'property_id,document_name' });
                });
            uploadPromises.push(uploadPromise);
        }
    }
    await Promise.all(uploadPromises);
}


export async function createProperty(formData: FormData) {
  const supabase = createClient();
  
  try {
    const { basicDetails, locationDetails, propertySpecificDetails, features, keywords } = getPropertyDataFromForm(formData);
    const slug = await generateSlug(supabase, basicDetails.title);
    
    const { data: propertyData, error: propertyError } = await supabase
      .from("properties")
      .insert({ ...basicDetails, ...locationDetails, slug, keywords })
      .select("id").single();
    if (propertyError) throw propertyError;
    const propertyId = propertyData.id;

    await supabase.from("property_details").insert({ property_id: propertyId, ...propertySpecificDetails });

    if (features.length > 0) {
      await supabase.from("property_features").insert(features.map((name, i) => ({ property_id: propertyId, feature_name: name, display_order: i })));
    }
    
    const serviceSupabase = createServiceRoleClient();
    await uploadAndLinkFiles(serviceSupabase, formData, propertyId);

    revalidatePath("/admin/properties");
    return { success: true, message: "Property created successfully", propertyId };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateProperty(formData: FormData) {
    const supabase = createClient();
    const serviceSupabase = createServiceRoleClient();
    const propertyId = Number(formData.get("property_id"));
    if (!propertyId) return { success: false, message: "Property ID is missing." };

    try {
        const { basicDetails, locationDetails, propertySpecificDetails, features, keywords, image_order } = getPropertyDataFromForm(formData);
        const slug = await generateSlug(supabase, basicDetails.title, propertyId);

        await supabase.from("properties").update({ ...basicDetails, ...locationDetails, slug, keywords }).eq("id", propertyId);

        await supabase.from("property_details").upsert({ property_id: propertyId, ...propertySpecificDetails }, { onConflict: 'property_id' });

        await supabase.from("property_features").delete().eq('property_id', propertyId);
        if (features.length > 0) {
            await supabase.from("property_features").insert(features.map((name, i) => ({ property_id: propertyId, feature_name: name, display_order: i })));
        }

        await uploadAndLinkFiles(serviceSupabase, formData, propertyId);

        revalidatePath("/admin/properties");
        revalidatePath(`/admin/properties/edit/${propertyId}`);
        return { success: true, message: "Property updated successfully", propertyId };
    } catch (error: any) {
        console.error('Update property error:', error);
        return { success: false, message: error.message };
    }
}
