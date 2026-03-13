import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    const phone = searchParams.get('phone')
    const orderId = searchParams.get('orderId')

    if (!email && !phone && !orderId) {
      return NextResponse.json(
        { error: 'Please provide email, phone, or order ID' },
        { status: 400 }
      )
    }

    let query = supabase.from('orders').select(`
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

    if (orderId) {
      query = query.eq('id', orderId)
    } else if (email) {
      query = query.eq('customer_email', email)
    } else if (phone) {
      query = query.eq('customer_phone', phone)
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve orders' },
        { status: 500 }
      )
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { orders: [], message: 'No orders found' },
        { status: 200 }
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
