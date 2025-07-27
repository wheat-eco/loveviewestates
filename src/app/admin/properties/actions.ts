
'use server'

import { createClient } from "@/utils/supabase/server"
import { createServiceRoleClient } from "@/utils/supabase/service-role"
import { revalidatePath } from "next/cache"
import { type NextRequest } from 'next/server';

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
  };
}

async function uploadFiles(supabase: any, formData: FormData, propertyId: number) {
    const uploadPromises = [];
    let displayOrder = 0;

    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            const file = value;
            const isImage = key.startsWith('image_');
            const isDocument = ['epc', 'floorplan', 'brochure', 'title_deed', 'lease_agreement', 'tenancy_agreement'].includes(key);

            let filePath = '';
            let fileType = '';
            
            if (isImage) {
                filePath = `property-images/${propertyId}/${Date.now()}-${file.name}`;
                fileType = 'image';
            } else if (isDocument) {
                filePath = `property-documents/${propertyId}/${Date.now()}-${file.name}`;
                fileType = 'document';
            } else {
                continue; // Skip if not a recognized file type
            }

            const uploadPromise = supabase.storage
                .from('properties')
                .upload(filePath, file)
                .then(async (uploadResult: { data: any, error: any }) => {
                    if (uploadResult.error) throw uploadResult.error;

                    const { data: urlData } = supabase.storage.from('properties').getPublicUrl(filePath);
                    
                    if (fileType === 'image') {
                        const { error: imageDbError } = await supabase.from('property_images').insert({
                            property_id: propertyId,
                            image_url: urlData.publicUrl,
                            is_featured: displayOrder === 0, // First image is featured
                            display_order: displayOrder++,
                        });
                        if (imageDbError) throw imageDbError;
                    } else if (fileType === 'document') {
                        const { error: docDbError } = await supabase.from('property_documents').insert({
                            property_id: propertyId,
                            document_url: urlData.publicUrl,
                            document_name: key,
                            document_type: key.toUpperCase(),
                            file_size: file.size,
                            mime_type: file.type,
                        });
                        if (docDbError) throw docDbError;
                    }
                });
            uploadPromises.push(uploadPromise);
        }
    }
    await Promise.all(uploadPromises);
}


export async function createProperty(formData: FormData) {
  const supabase = createClient();
  // Server actions don't need manual session checking, it's handled by Next.js/Supabase middleware
  
  try {
    const { basicDetails, locationDetails, propertySpecificDetails, features, keywords } = getPropertyDataFromForm(formData);
    const slug = await generateSlug(supabase, basicDetails.title);
    
    // 1. Insert into properties table
    const { data: propertyData, error: propertyError } = await supabase
      .from("properties")
      .insert({ ...basicDetails, ...locationDetails, slug, keywords })
      .select("id").single();
    if (propertyError) throw propertyError;
    const propertyId = propertyData.id;

    // 2. Insert into property_details
    await supabase.from("property_details").insert({ property_id: propertyId, ...propertySpecificDetails });

    // 3. Insert features
    if (features.length > 0) {
      await supabase.from("property_features").insert(features.map((name, i) => ({ property_id: propertyId, feature_name: name, display_order: i })));
    }
    
    // 4. Upload files
    const serviceSupabase = createServiceRoleClient();
    await uploadFiles(serviceSupabase, formData, propertyId);

    revalidatePath("/admin/properties");
    return { success: true, message: "Property created successfully", propertyId };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateProperty(formData: FormData) {
    const supabase = createClient();
    // Server actions don't need manual session checking

    const propertyId = Number(formData.get("property_id"));
    if (!propertyId) return { success: false, message: "Property ID is missing." };

    try {
        const { basicDetails, locationDetails, propertySpecificDetails, features, keywords } = getPropertyDataFromForm(formData);
        const slug = await generateSlug(supabase, basicDetails.title, propertyId);

        // 1. Update properties table
        await supabase.from("properties").update({ ...basicDetails, ...locationDetails, slug, keywords }).eq("id", propertyId);

        // 2. Upsert property_details
        await supabase.from("property_details").upsert({ property_id: propertyId, ...propertySpecificDetails }, { onConflict: 'property_id' });

        // 3. Update features (delete all and re-insert)
        await supabase.from("property_features").delete().eq('property_id', propertyId);
        if (features.length > 0) {
            await supabase.from("property_features").insert(features.map((name, i) => ({ property_id: propertyId, feature_name: name, display_order: i })));
        }

        // 4. Upload NEW files
        const serviceSupabase = createServiceRoleClient();
        await uploadFiles(serviceSupabase, formData, propertyId);

        revalidatePath("/admin/properties");
        revalidatePath(`/admin/properties/edit/${propertyId}`);
        return { success: true, message: "Property updated successfully", propertyId };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
