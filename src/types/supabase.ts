type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
export default Json

export interface Database {
  public: {
    Tables: {
      areas: {
        Row: {
          id: number
          name: string
          slug: string
          region_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          region_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          region_id?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          id: number
          title: string
          slug: string
          description: string | null
          area_id: number
          address: string
          postcode: string
          latitude: number | null
          longitude: number | null
          property_category: string
          property_type: string
          bedrooms: number
          bathrooms: number
          price: number
          available_date: string | null
          status: string | null
          featured: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          description?: string | null
          area_id: number
          address: string
          postcode: string
          latitude?: number | null
          longitude?: number | null
          property_category: string
          property_type: string
          bedrooms: number
          bathrooms: number
          price: number
          available_date?: string | null
          status?: string | null
          featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          description?: string | null
          area_id?: number
          address?: string
          postcode?: string
          latitude?: number | null
          longitude?: number | null
          property_category?: string
          property_type?: string
          bedrooms?: number
          bathrooms?: number
          price?: number
          available_date?: string | null
          status?: string | null
          featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_area_id_fkey"
            columns: ["area_id"]
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          id: number
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      viewing_requests: {
        Row: {
          id: number
          property_id: number
          name: string
          email: string
          phone: string
          preferred_date: string | null
          message: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          property_id: number
          name: string
          email: string
          phone: string
          preferred_date?: string | null
          message?: string | null
          status: string
          created_at?: string
        }
        Update: {
          id?: number
          property_id?: number
          name?: string
          email?: string
          phone?: string
          preferred_date?: string | null
          message?: string | null
          status?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
