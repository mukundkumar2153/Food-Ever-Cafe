'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  veg: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'cash_on_delivery',
  })

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const items = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }))

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          items,
          notes: formData.notes,
          payment_method: formData.paymentMethod,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOrderId(data.order.id)
        setOrderPlaced(true)
        localStorage.removeItem('cart')
        setCart([])
      } else {
        alert(data.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
        <div className="max-w-2xl mx-auto pt-12">
          <Card className="p-8 text-center border-2 border-green-500">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. Your order ID is:
            </p>
            <div className="bg-amber-50 p-4 rounded-lg mb-6 border-2 border-amber-200">
              <p className="text-2xl font-mono font-bold text-amber-900">{orderId}</p>
            </div>
            <p className="text-gray-600 mb-8">
              We'll send updates to <strong>{formData.email}</strong>
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Back to Menu
                </Button>
              </Link>
              <Link href={`/track-order?email=${formData.email}`}>
                <Button variant="outline">
                  Track Order
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
        <div className="max-w-2xl mx-auto pt-12">
          <Card className="p-8 text-center">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
            <Link href="/">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto p-4">
        <div className="py-8">
          <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold mb-4 inline-block">
            ← Back to Menu
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your full delivery address"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="cash_on_delivery">Cash on Delivery</option>
                    <option value="online_payment">Online Payment (Coming Soon)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions? (optional)"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold bg-amber-50 p-3 rounded-lg">
                  <span>Total</span>
                  <span className="text-amber-600">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
