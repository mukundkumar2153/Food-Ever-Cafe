import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          item_name,
          item_price,
          quantity,
          subtotal
        ),
        order_status_history(
          id,
          status,
          changed_at,
          note
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve orders' },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
