import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      it_support_tickets: {
        Row: {
          id: string
          name: string
          email: string
          issue: string
          submitted_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          issue: string
          submitted_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          issue?: string
          submitted_at?: string
        }
      }
    }
  }
}