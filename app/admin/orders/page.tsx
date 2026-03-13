'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface OrderItem {
  id: string
  item_name: string
  item_price: number
  quantity: number
  subtotal: number
}

interface Order {
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
  order_items?: OrderItem[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (authenticated) {
      fetchOrders()
    }
  }, [authenticated, filter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders/admin/list')
      const data = await response.json()
      
      let filteredOrders = data.orders || []
      if (filter !== 'all') {
        filteredOrders = filteredOrders.filter((order: Order) => order.status === filter)
      }
      
      setOrders(filteredOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus, password }),
      })

      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ))
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check (in production, use proper authentication)
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setAuthenticated(true)
    } else {
      alert('Invalid password')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
              Login
            </Button>
          </form>
          <p className="text-sm text-gray-500 text-center mt-4">
            Demo password: admin123
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button
            onClick={() => {
              setAuthenticated(false)
              setPassword('')
            }}
            variant="outline"
          >
            Logout
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'preparing', label: 'Preparing' },
            { id: 'ready', label: 'Ready' },
            { id: 'out_for_delivery', label: 'Out for Delivery' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === f.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border-2 border-amber-200 text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Loading orders...</p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No orders found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono font-bold text-lg">{order.id}</p>
                  </div>
                  <div className="text-right md:text-left">
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Customer</p>
                    <p className="font-semibold">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold">{order.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">{order.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-bold text-amber-600">₹{order.total_amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-1">Delivery Address</p>
                  <p className="text-sm">{order.customer_address}</p>
                </div>

                {order.notes && (
                  <div className="mb-4 bg-blue-50 p-3 rounded">
                    <p className="text-gray-600 text-sm mb-1">Notes</p>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}

                <div className="bg-gray-50 p-3 rounded mb-4">
                  <p className="text-sm text-gray-600 mb-2">Items:</p>
                  <div className="space-y-1 text-sm">
                    {order.order_items?.map((item) => (
                      <p key={item.id}>
                        {item.item_name} x {item.quantity} = ₹{item.subtotal.toFixed(2)}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      disabled={order.status === status}
                      className={`px-3 py-1 rounded text-sm font-semibold transition ${
                        order.status === status
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </button>
                  ))}
                  <button
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className={`px-3 py-1 rounded text-sm font-semibold transition ${
                      order.status === 'cancelled'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                    disabled={order.status === 'cancelled'}
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Ordered on {new Date(order.created_at).toLocaleString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
