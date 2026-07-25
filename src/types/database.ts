export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      dealers: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          id: string
          logo_url: string | null
          name: string
          operating_hours: Json | null
          phone: string
          province: string
          slug: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email: string
          id?: string
          logo_url?: string | null
          name: string
          operating_hours?: Json | null
          phone: string
          province?: string
          slug: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          id?: string
          logo_url?: string | null
          name?: string
          operating_hours?: Json | null
          phone?: string
          province?: string
          slug?: string
        }
        Relationships: []
      }
      lead_timeline: {
        Row: {
          action: string
          created_at: string
          created_by: string | null
          details: string | null
          id: string
          lead_id: string
        }
        Insert: {
          action: string
          created_at?: string
          created_by?: string | null
          details?: string | null
          id?: string
          lead_id: string
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string | null
          details?: string | null
          id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_timeline_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_timeline_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          created_at: string
          dealer_id: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          lost_reason: string | null
          notes: string | null
          phone: string
          source: string
          status: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          dealer_id: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          lost_reason?: string | null
          notes?: string | null
          phone: string
          source: string
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          dealer_id?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          lost_reason?: string | null
          notes?: string | null
          phone?: string
          source?: string
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_verifications: {
        Row: {
          anomaly_flags: string[] | null
          billing_amount: number
          created_at: string
          crm_closed: boolean
          crm_closed_at: string | null
          crm_closed_by: string | null
          dealer_id: string
          delivery_checklist: Json | null
          delivery_confirmed: boolean
          delivery_confirmed_at: string | null
          delivery_photo_url: string | null
          id: string
          inventory_marked: boolean
          inventory_marked_at: string | null
          inventory_marked_by: string | null
          invoice_generated: boolean
          lead_id: string
          marketplace_delisted: boolean
          marketplace_delisted_at: string | null
          reconciled: boolean
          reconciled_at: string | null
          reconciled_by: string | null
          sale_id: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          anomaly_flags?: string[] | null
          billing_amount?: number
          created_at?: string
          crm_closed?: boolean
          crm_closed_at?: string | null
          crm_closed_by?: string | null
          dealer_id: string
          delivery_checklist?: Json | null
          delivery_confirmed?: boolean
          delivery_confirmed_at?: string | null
          delivery_photo_url?: string | null
          id?: string
          inventory_marked?: boolean
          inventory_marked_at?: string | null
          inventory_marked_by?: string | null
          invoice_generated?: boolean
          lead_id: string
          marketplace_delisted?: boolean
          marketplace_delisted_at?: string | null
          reconciled?: boolean
          reconciled_at?: string | null
          reconciled_by?: string | null
          sale_id: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          anomaly_flags?: string[] | null
          billing_amount?: number
          created_at?: string
          crm_closed?: boolean
          crm_closed_at?: string | null
          crm_closed_by?: string | null
          dealer_id?: string
          delivery_checklist?: Json | null
          delivery_confirmed?: boolean
          delivery_confirmed_at?: string | null
          delivery_photo_url?: string | null
          id?: string
          inventory_marked?: boolean
          inventory_marked_at?: string | null
          inventory_marked_by?: string | null
          invoice_generated?: boolean
          lead_id?: string
          marketplace_delisted?: boolean
          marketplace_delisted_at?: string | null
          reconciled?: boolean
          reconciled_at?: string | null
          reconciled_by?: string | null
          sale_id?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_verifications_crm_closed_by_fkey"
            columns: ["crm_closed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_verifications_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_verifications_inventory_marked_by_fkey"
            columns: ["inventory_marked_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_verifications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_verifications_reconciled_by_fkey"
            columns: ["reconciled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_verifications_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_verifications_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          dealer_id: string
          id: string
          lead_id: string
          sale_date: string
          sale_price: number
          salesperson_id: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          dealer_id: string
          id?: string
          lead_id: string
          sale_date?: string
          sale_price: number
          salesperson_id?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          dealer_id?: string
          id?: string
          lead_id?: string
          sale_date?: string
          sale_price?: number
          salesperson_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_salesperson_id_fkey"
            columns: ["salesperson_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          dealer_id: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          dealer_id: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          phone?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          dealer_id?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          body_type: string | null
          colour: string
          created_at: string
          dealer_id: string
          description: string | null
          engine_size: string | null
          features: string[] | null
          fuel_type: string
          id: string
          images: string[] | null
          is_featured: boolean
          make: string
          mileage: number
          model: string
          price: number
          registration: string | null
          status: string
          thumbnail: string | null
          transmission: string
          updated_at: string
          variant: string | null
          vin: string | null
          year: number
        }
        Insert: {
          body_type?: string | null
          colour: string
          created_at?: string
          dealer_id: string
          description?: string | null
          engine_size?: string | null
          features?: string[] | null
          fuel_type: string
          id?: string
          images?: string[] | null
          is_featured?: boolean
          make: string
          mileage?: number
          model: string
          price: number
          registration?: string | null
          status?: string
          thumbnail?: string | null
          transmission: string
          updated_at?: string
          variant?: string | null
          vin?: string | null
          year: number
        }
        Update: {
          body_type?: string | null
          colour?: string
          created_at?: string
          dealer_id?: string
          description?: string | null
          engine_size?: string | null
          features?: string[] | null
          fuel_type?: string
          id?: string
          images?: string[] | null
          is_featured?: boolean
          make?: string
          mileage?: number
          model?: string
          price?: number
          registration?: string | null
          status?: string
          thumbnail?: string | null
          transmission?: string
          updated_at?: string
          variant?: string | null
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
