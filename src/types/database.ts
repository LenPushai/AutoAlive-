// Auto-generated Supabase types will go here
// Run: npx supabase gen types typescript --local > src/types/database.ts
// For now, placeholder:

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: import('./vehicle').Vehicle
        Insert: import('./vehicle').VehicleInsert
        Update: import('./vehicle').VehicleUpdate
      }
      leads: {
        Row: import('./lead').Lead
        Insert: import('./lead').LeadInsert
        Update: import('./lead').LeadUpdate
      }
      sale_verifications: {
        Row: import('./sale').SaleVerification
        Insert: import('./sale').SaleVerificationInsert
        Update: Partial<import('./sale').SaleVerificationInsert>
      }
    }
  }
}
