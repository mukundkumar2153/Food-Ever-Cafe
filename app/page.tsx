'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown,
  MapPin,
  Phone,
  Clock,
  ShoppingCart,
  Star,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  isVeg: boolean;
  image?: string;
  popular?: boolean;
}

const menuItems: MenuItem[] = [
  // Pizzas
  {
    id: '1',
    name: 'Margherita Pizza',
    category: 'pizza',
    price: 199,
    description: 'Classic tomato base with mozzarella cheese and fresh basil',
    isVeg: true,
    image: '/images/pizza.jpg',
    popular: true,
  },
  {
    id: '2',
    name: 'Farm Fresh Veggie',
    category: 'pizza',
    price: 229,
    description: 'Loaded with capsicum, onion, corn, mushroom & olives',
    isVeg: true,
    image: '/images/pizza.jpg',
  },
  {
    id: '3',
    name: 'Chicken Tikka Pizza',
    category: 'pizza',
    price: 269,
    description: 'Spicy chicken tikka chunks with tangy red sauce & cheese',
    isVeg: false,
    image: '/images/pizza.jpg',
    popular: true,
  },
  {
    id: '4',
    name: 'BBQ Chicken Pizza',
    category: 'pizza',
    price: 279,
    description: 'Smoky BBQ sauce, grilled chicken, caramelised onions',
    isVeg: false,
    image: '/images/pizza.jpg',
  },
  // Burgers
  {
    id: '5',
    name: 'Veg Aloo Burger',
    category: 'burger',
    price: 79,
    description: 'Crispy aloo tikki with fresh veggies and zesty sauces',
    isVeg: true,
    image: '/images/burger.jpg',
  },
  {
    id: '6',
    name: 'Paneer Burger',
    category: 'burger',
    price: 109,
    description: 'Grilled paneer patty with lettuce, cheese & mayo',
    isVeg: true,
    image: '/images/burger.jpg',
  },
  {
    id: '7',
    name: 'Chicken Burger',
    category: 'burger',
    price: 129,
    description: 'Juicy chicken patty, crunchy lettuce, chipotle mayo',
    isVeg: false,
    image: '/images/burger.jpg',
    popular: true,
  },
  {
    id: '8',
    name: 'Spicy Chicken Burger',
    category: 'burger',
    price: 139,
    description: 'Extra spicy crispy chicken with sriracha drizzle',
    isVeg: false,
    image: '/images/burger.jpg',
  },
  // Snacks
  {
    id: '9',
    name: 'French Fries',
    category: 'snacks',
    price: 79,
    description: 'Golden crispy fries served with ketchup & mayo dip',
    isVeg: true,
    image: '/images/fries.jpg',
  },
  {
    id: '10',
    name: 'Veg Sandwich',
    category: 'snacks',
    price: 69,
    description: 'Toasted sandwich with veggies, cheese & green chutney',
    isVeg: true,
    image: '/images/fries.jpg',
  },
  {
    id: '11',
    name: 'Chicken Roll',
    category: 'snacks',
    price: 119,
    description: 'Soft roll with spicy chicken filling, onions & sauces',
    isVeg: false,
    image: '/images/fries.jpg',
  },
  {
    id: '12',
    name: 'Cheese Garlic Bread',
    category: 'snacks',
    price: 99,
    description: 'Toasted garlic bread loaded with melted cheese',
    isVeg: true,
    image: '/images/fries.jpg',
  },
  // Beverages
  {
    id: '13',
    name: 'Cold Coffee',
    category: 'beverages',
    price: 89,
    description: 'Chilled blended coffee with ice cream & chocolate drizzle',
    isVeg: true,
    image: '/images/coffee.jpg',
    popular: true,
  },
  {
    id: '14',
    name: 'Fresh Lime Soda',
    category: 'beverages',
    price: 59,
    description: 'Refreshing lime with soda, sweet or salted',
    isVeg: true,
    image: '/images/coffee.jpg',
  },
  {
    id: '15',
    name: 'Mango Shake',
    category: 'beverages',
    price: 99,
    description: 'Thick creamy mango milkshake made with fresh mangoes',
    isVeg: true,
    image: '/images/coffee.jpg',
  },
  {
    id: '16',
    name: 'Masala Chai',
    category: 'beverages',
    price: 29,
    description: 'Classic Indian spiced tea brewed fresh',
    isVeg: true,
    image: '/images/coffee.jpg',
  },
  // Desserts
  {
    id: '17',
    name: 'Chocolate Brownie',
    category: 'desserts',
    price: 99,
    description: 'Warm fudgy brownie served with vanilla ice cream',
    isVeg: true,
    image: '/images/dessert.jpg',
    popular: true,
  },
  {
    id: '18',
    name: 'Gulab Jamun (2 pcs)',
    category: 'desserts',
    price: 59,
    description: 'Soft classic gulab jamuns served warm in syrup',
    isVeg: true,
    image: '/images/dessert.jpg',
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const filteredItems =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Items', icon: '🍽️' },
    { id: 'pizza', label: 'Pizza', icon: '🍕' },
    { id: 'burger', label: 'Burgers', icon: '🍔' },
    { id: 'snacks', label: 'Snacks', icon: '🍟' },
    { id: 'beverages', label: 'Beverages', icon: '🥤' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
  ];

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const openWhatsApp = () => {
    const cartText = cart
      .map((item) => `${item.name} - ₹${item.price}`)
      .join('\n');
    const total = `\n\nTotal: ₹${cartTotal}`;
    const msg = encodeURIComponent(
      `Hello Food Ever Cafe! 👋\n\nI'd like to place an order.\n\nMy order:\n${cartText}${total}\n\n📍 Delivery address: \n📞 My number: \n\nThank you!`
    );
    window.open('https://wa.me/917841028217?text=' + msg, '_blank');
  };

  const handleCheckout = () => {
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <div className="font-bold text-xl">
                Food Ever <span className="text-amber-600">Cafe</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#about"
                className="text-gray-700 hover:text-amber-600 transition"
              >
                About
              </a>
              <a
                href="#menu"
                className="text-gray-700 hover:text-amber-600 transition"
              >
                Menu
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-amber-600 transition"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 hover:bg-amber-100 rounded-lg transition"
              >
                <ShoppingCart className="w-6 h-6 text-amber-600" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="md:hidden p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileNavOpen && (
            <div className="md:hidden pb-4 border-t border-amber-100">
              <a
                href="#about"
                className="block py-2 text-gray-700 hover:text-amber-600"
              >
                About
              </a>
              <a
                href="#menu"
                className="block py-2 text-gray-700 hover:text-amber-600"
              >
                Menu
              </a>
              <a
                href="#contact"
                className="block py-2 text-gray-700 hover:text-amber-600"
              >
                Contact
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            ✨ Now Open · Naigaon East
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Fresh Food,{' '}
            <span className="text-amber-600">Every Time.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the finest flavours at Food Ever Cafe — your neighbourhood
            spot for delicious meals, fresh snacks, and warm vibes in Naigaon
            East, Mumbai.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#menu"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Explore Menu
            </a>
            <button
              onClick={openWhatsApp}
              className="border-2 border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 rounded-lg font-semibold transition"
            >
              Order Now
            </button>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-64 sm:h-96">
          <Image
            src="/images/cafe.jpg"
            alt="Food Ever Cafe Interior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="text-white p-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">Top Rated</span>
              </div>
              <h3 className="text-2xl font-bold">Food Ever Cafe</h3>
              <p className="text-amber-100">
                Naigaon East, Mumbai · Dine In · Delivery · Takeaway
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-amber-400 text-sm font-bold uppercase tracking-wider mb-3">
            Our Story
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Made With Love, Served With Pride
          </h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Food Ever Cafe is your go-to neighbourhood cafe in Naigaon East,
            crafting every dish with fresh ingredients and genuine passion.
            Whether you're grabbing a quick bite or settling in for a full meal,
            every plate that leaves our kitchen is something you'll remember.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
              <div className="text-3xl mb-3">🥗</div>
              <h4 className="font-bold mb-2">Fresh Daily</h4>
              <p className="text-gray-300 text-sm">
                Sourced locally every morning
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-bold mb-2">Quick Service</h4>
              <p className="text-gray-300 text-sm">
                Fast delivery & dine-in service
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
              <div className="text-3xl mb-3">💚</div>
              <h4 className="font-bold mb-2">Veg & Non-Veg</h4>
              <p className="text-gray-300 text-sm">
                Wide variety for everyone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-amber-600 text-sm font-bold uppercase tracking-wider mb-3">
              Our Menu
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What We Serve
            </h2>
            <p className="text-lg text-gray-600">
              From sizzling pizzas to refreshing drinks — explore our full menu
              below.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full font-semibold transition transform hover:scale-105 ${
                  activeCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white border-2 border-amber-200 text-gray-700 hover:border-amber-400'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden border border-amber-100"
              >
                {/* Item Image */}
                {item.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {item.popular && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Popular
                      </div>
                    )}
                    <div
                      className={`absolute top-3 left-3 w-5 h-5 border-2 rounded-sm ${
                        item.isVeg
                          ? 'border-green-600 bg-green-100'
                          : 'border-red-600 bg-red-100'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                          item.isVeg ? 'bg-green-600' : 'bg-red-600'
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-amber-600 font-bold text-lg">
                      ₹{item.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-amber-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-amber-600 text-sm font-bold uppercase tracking-wider mb-3">
              Find Us
            </div>
            <h2 className="text-4xl font-bold text-gray-900">Visit Us Today</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600 text-sm">
                      Shop No. 02, Near Rashmi Star City,
                      <br />
                      Naigaon East, Juchandra,
                      <br />
                      Mumbai, Maharashtra 401208
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Phone</h4>
                    <a
                      href="tel:+917841028217"
                      className="text-amber-600 hover:text-amber-700 font-semibold"
                    >
                      +91 7841 028217
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Opening Hours
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Monday – Sunday
                      <br />
                      10:00 AM – 11:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden shadow-lg h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d93.07!2d72.8624044!3d19.3577447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7affb88680af9%3A0x8255fa74eb5cd653!2sFood%20Ever%20Cafe!5e1!3m2!1sen!2sin!4v1710000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cart Sidebar - Mobile */}
      {showCart && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/50">
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold">Your Cart</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-amber-50 p-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-amber-600 font-bold">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6 space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-amber-600">₹{cartTotal}</span>
                </div>
                <Link href="/checkout" onClick={handleCheckout} className="block">
                  <button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold transition"
                  >
                    🛒 Online Checkout
                  </button>
                </Link>
                <button
                  onClick={openWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition"
                >
                  💬 Order via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Modal - Desktop */}
      {showCart && (
        <div className="hidden md:flex fixed inset-0 z-40 items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h3 className="text-2xl font-bold">Your Cart</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Cart is empty</p>
              ) : (
                <div className="space-y-3 mb-6">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-amber-50 p-4 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-amber-600 font-bold">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-red-500 hover:text-red-700 ml-4 text-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-amber-600">₹{cartTotal}</span>
                  </div>
                  <Link href="/checkout" onClick={handleCheckout} className="block">
                    <button
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold transition"
                    >
                      🛒 Online Checkout
                    </button>
                  </Link>
                  <button
                    onClick={openWhatsApp}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition"
                  >
                    💬 Order via WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🍽️</span>
            <div className="font-bold text-xl">
              Food Ever <span className="text-amber-400">Cafe</span>
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            Shop No. 02, Near Rashmi Star City, Naigaon East, Mumbai 401208
          </p>
          <div className="flex flex-wrap gap-6 justify-center mb-6 text-sm text-gray-400">
            <a href="#about" className="hover:text-amber-400 transition">
              About
            </a>
            <a href="#menu" className="hover:text-amber-400 transition">
              Menu
            </a>
            <a href="#contact" className="hover:text-amber-400 transition">
              Contact
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 Food Ever Cafe. All rights reserved. Made with ❤️ in Naigaon.
          </p>
        </div>
      </footer>
    </div>
  );
}
