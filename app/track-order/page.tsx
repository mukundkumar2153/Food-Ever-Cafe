'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface OrderItem {
  id: string
  item_name: string
  item_price: number
  quantity: number
  subtotal: number
}

interface StatusHistory {
  id: string
  status: string
  changed_at: string
  note: string
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
  order_items: OrderItem[]
  order_status_history: StatusHistory[]
}

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '⏳' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '✓' },
  preparing: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '👨‍🍳' },
  ready: { bg: 'bg-orange-50', text: 'text-orange-700', icon: '📦' },
  out_for_delivery: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: '🚗' },
  delivered: { bg: 'bg-green-50', text: 'text-green-700', icon: '✅' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', icon: '❌' },
}

export default function TrackOrderPage() {
  const [searchType, setSearchType] = useState<'email' | 'phone' | 'orderId'>('email')
  const [searchValue, setSearchValue] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrders([])

    try {
      const params = new URLSearchParams()
      if (searchType === 'email') params.append('email', searchValue)
      else if (searchType === 'phone') params.append('phone', searchValue)
      else params.append('orderId', searchValue)

      const response = await fetch(`/api/orders/track?${params}`)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders)
        if (data.orders.length === 0) {
          setError('No orders found. Try another search.')
        }
      } else {
        setError(data.error || 'Failed to fetch orders')
      }
    } catch (err) {
      setError('Error searching for orders')
      console.error(err)
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const getStatusInfo = (status: string) => {
    return statusColors[status] || statusColors['pending']
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="py-8">
          <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold mb-4 inline-block">
            ← Back to Menu
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your email, phone, or order ID to check your order status</p>
        </div>

        {/* Search Form */}
        <Card className="p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="email"
                    checked={searchType === 'email'}
                    onChange={(e) => {
                      setSearchType(e.target.value as 'email' | 'phone' | 'orderId')
                      setSearchValue('')
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="phone"
                    checked={searchType === 'phone'}
                    onChange={(e) => {
                      setSearchType(e.target.value as 'email' | 'phone' | 'orderId')
                      setSearchValue('')
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">Phone</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="orderId"
                    checked={searchType === 'orderId'}
                    onChange={(e) => {
                      setSearchType(e.target.value as 'email' | 'phone' | 'orderId')
                      setSearchValue('')
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">Order ID</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Input
                type={searchType === 'email' ? 'email' : 'text'}
                placeholder={
                  searchType === 'email'
                    ? 'Enter your email'
                    : searchType === 'phone'
                      ? 'Enter your phone number'
                      : 'Enter your order ID'
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={loading || !searchValue}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8"
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="p-6 mb-8 bg-red-50 border-2 border-red-200">
            <p className="text-red-700 font-semibold">{error}</p>
          </Card>
        )}

        {/* Orders List */}
        {searched && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <Card key={order.id} className="overflow-hidden">
                  {/* Order Header */}
                  <div className={`p-6 ${statusInfo.bg}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="text-2xl font-mono font-bold text-gray-900">{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Status</p>
                        <div className={`flex items-center gap-2 text-lg font-bold ${statusInfo.text}`}>
                          <span>{statusInfo.icon}</span>
                          <span>{order.status.replace('_', ' ').toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ordered on {formatDate(order.created_at)}
                    </p>
                  </div>

                  {/* Order Details */}
                  <div className="p-6 space-y-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Delivery Details</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-600">Name:</span> <span className="font-medium">{order.customer_name}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">Phone:</span> <span className="font-medium">{order.customer_phone}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">Address:</span> <span className="font-medium">{order.customer_address}</span>
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                      <div className="space-y-2 text-sm">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                            <span>
                              {item.item_name} x {item.quantity}
                            </span>
                            <span className="font-semibold">₹{item.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                        <span className="text-2xl font-bold text-amber-600">₹{order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Order Timeline</h3>
                      <div className="space-y-3">
                        {order.order_status_history.map((history, index) => {
                          const historyStatusInfo = getStatusInfo(history.status)
                          return (
                            <div key={history.id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${historyStatusInfo.bg} ${historyStatusInfo.text}`}>
                                  {historyStatusInfo.icon}
                                </div>
                                {index < order.order_status_history.length - 1 && (
                                  <div className="w-0.5 h-12 bg-gray-300 my-2" />
                                )}
                              </div>
                              <div className="pb-4">
                                <p className="font-semibold text-gray-900">
                                  {history.status.replace('_', ' ').toUpperCase()}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(history.changed_at)}
                                </p>
                                {history.note && (
                                  <p className="text-sm text-gray-700 mt-1">{history.note}</p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {order.notes && (
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm text-gray-600 mb-1">Special Instructions</p>
                        <p className="text-gray-900">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {searched && orders.length === 0 && !error && (
          <Card className="p-12 text-center">
            <p className="text-2xl mb-4">🔍</p>
            <p className="text-xl text-gray-600 mb-4">No orders found</p>
            <p className="text-gray-500 mb-6">Try searching with a different email, phone number, or order ID</p>
            <Button
              onClick={() => {
                setSearched(false)
                setSearchValue('')
              }}
              className="bg-amber-600 hover:bg-amber-700"
            >
              New Search
            </Button>
          </Card>
        )}

        {/* Initial State */}
        {!searched && (
          <Card className="p-12 text-center bg-amber-50 border-2 border-amber-200">
            <p className="text-2xl mb-4">📦</p>
            <p className="text-xl text-gray-600">Enter your details to track your order</p>
          </Card>
        )}
      </div>
    </div>
  )
}
