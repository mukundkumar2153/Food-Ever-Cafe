import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      items,
      notes,
      payment_method = 'cash_on_delivery',
    } = body

    // Validate required fields
    if (!customer_name || !customer_email || !customer_phone || !customer_address || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const total_amount = items.reduce((sum: number, item: any) => sum + item.subtotal, 0)

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        total_amount,
        payment_method,
        notes,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItemsData = items.map((item: any) => ({
      order_id: order.id,
      item_name: item.name,
      item_price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData)

    if (itemsError) {
      console.error('Order items creation error:', itemsError)
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      )
    }

    // Create initial status history entry
    await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        status: 'pending',
        note: 'Order created',
      })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        customer_email: order.customer_email,
        total_amount: order.total_amount,
        status: order.status,
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
