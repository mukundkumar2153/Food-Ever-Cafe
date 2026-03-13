import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  total_amount: number
  status: string
  payment_method?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  item_name: string
  item_price: number
  quantity: number
  subtotal: number
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
}
