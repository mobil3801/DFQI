import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these from your Supabase dashboard)
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add more tables as needed
    }
  }
}