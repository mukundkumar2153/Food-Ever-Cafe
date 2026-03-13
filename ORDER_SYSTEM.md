# Food Ever Cafe - Order System Documentation

## Overview
The Food Ever Cafe now has a complete real order management system integrated with Supabase PostgreSQL. Customers can place online orders, track their status, and admins can manage all orders.

## Features

### 1. **Online Ordering System**
- Customers add items to cart from the menu
- Cart is persisted to localStorage
- Two checkout options:
  - **Online Checkout** - Place orders directly through the app
  - **WhatsApp Orders** - Quick WhatsApp integration as alternative

### 2. **Order Placement**
- **Location**: `/checkout` page
- **Required Information**:
  - Full Name
  - Email Address
  - Phone Number
  - Delivery Address
  - Special Instructions (optional)
  - Payment Method (Cash on Delivery or Online Payment)

- **Process**:
  1. Customer enters delivery details
  2. System validates all required fields
  3. Order is created in database with `pending` status
  4. Order items are stored in separate table
  5. Confirmation page shows Order ID
  6. Email confirmation sent (ready to integrate)

### 3. **Order Tracking**
- **Location**: `/track-order` page
- **Search Methods**:
  - By Email Address
  - By Phone Number
  - By Order ID

- **Information Displayed**:
  - Order ID and status
  - Order date and time
  - Delivery details
  - Itemized list of ordered items
  - Total amount
  - Complete order timeline with status changes

### 4. **Admin Dashboard**
- **Location**: `/admin/orders`
- **Authentication**: Password protected (demo: `admin123`)
- **Features**:
  - View all orders
  - Filter by status (Pending, Confirmed, Preparing, Ready, Out for Delivery, Delivered, Cancelled)
  - Update order status
  - View detailed order information
  - See customer contact details and delivery address

### 5. **Order Statuses**
1. **Pending** - Order just received, waiting for confirmation
2. **Confirmed** - Order accepted by restaurant
3. **Preparing** - Kitchen is preparing the order
4. **Ready** - Order is ready for pickup/delivery
5. **Out for Delivery** - Order is on the way
6. **Delivered** - Order successfully delivered
7. **Cancelled** - Order was cancelled

## Database Schema

### Tables

#### `orders`
```sql
- id: UUID (Primary Key)
- customer_name: VARCHAR(255)
- customer_email: VARCHAR(255)
- customer_phone: VARCHAR(20)
- customer_address: TEXT
- total_amount: DECIMAL(10,2)
- status: VARCHAR(50) [pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled]
- payment_method: VARCHAR(50) [cash_on_delivery, online_payment]
- notes: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `order_items`
```sql
- id: UUID (Primary Key)
- order_id: UUID (Foreign Key)
- item_name: VARCHAR(255)
- item_price: DECIMAL(10,2)
- quantity: INTEGER
- subtotal: DECIMAL(10,2)
- created_at: TIMESTAMP
```

#### `order_status_history`
```sql
- id: UUID (Primary Key)
- order_id: UUID (Foreign Key)
- status: VARCHAR(50)
- changed_at: TIMESTAMP
- note: TEXT
```

## API Endpoints

### Create Order
**POST** `/api/orders/create`

Request:
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+91 98765 43210",
  "customer_address": "123 Main St, City",
  "items": [
    {
      "name": "Margherita Pizza",
      "price": 199,
      "quantity": 1,
      "subtotal": 199
    }
  ],
  "notes": "Extra cheese please",
  "payment_method": "cash_on_delivery"
}
```

Response:
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "customer_email": "john@example.com",
    "total_amount": 199,
    "status": "pending"
  }
}
```

### Track Order
**GET** `/api/orders/track?email=user@example.com`

Query Parameters:
- `email`: Customer email
- `phone`: Customer phone number
- `orderId`: Order ID

Response:
```json
{
  "orders": [
    {
      "id": "uuid",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "total_amount": 199,
      "status": "preparing",
      "created_at": "2025-03-12T10:00:00Z",
      "order_items": [...],
      "order_status_history": [...]
    }
  ]
}
```

### Admin - List Orders
**GET** `/api/orders/admin/list`

Response: Returns all orders with items and status history

### Admin - Update Order Status
**POST** `/api/orders/admin/update-status`

Request:
```json
{
  "orderId": "uuid",
  "status": "confirmed",
  "password": "admin123"
}
```

## User Interface

### Home Page (Menu)
- Menu items with images
- Add to cart functionality
- Cart displays in sidebar (mobile) or modal (desktop)
- Two ordering options visible in cart:
  1. Online Checkout button (new)
  2. WhatsApp Order button (existing)

### Checkout Page
- Clean form with all required fields
- Order summary sidebar
- Item list with quantities and prices
- Total amount calculation
- Success page with Order ID after submission

### Order Tracking Page
- Multiple search options (email, phone, order ID)
- Complete order timeline with status badges
- Estimated delivery information
- Special instructions display
- Order history (all orders for that customer)

### Admin Dashboard
- Password login page
- All orders list with filters
- Quick status update buttons
- Customer contact information
- Itemized order details
- Status change history

## File Structure
```
/app
  /api
    /orders
      /create
        route.ts          # Create new order
      /track
        route.ts          # Track order by email/phone
      /admin
        /list
          route.ts        # List all orders (admin)
        /update-status
          route.ts        # Update order status (admin)
  /checkout
    page.tsx             # Checkout form page
  /track-order
    page.tsx             # Order tracking page
  /admin
    /orders
      page.tsx           # Admin dashboard
  page.tsx               # Home/menu page (updated with checkout)

/lib
  supabase-client.ts     # Supabase client and types

/public
  /images
    pizza.jpg
    burger.jpg
    coffee.jpg
    dessert.jpg
    cafe.jpg
```

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
ADMIN_PASSWORD=your_admin_password
```

## Features Coming Soon

- Email notifications for order confirmations and status updates
- Online payment integration (Stripe/Razorpay)
- SMS notifications
- Real-time order notifications using Supabase Real-time
- Customer account history
- Multiple delivery address management
- Order ratings and reviews

## Testing

### Demo Data
1. Go to `/checkout` with items in cart
2. Fill in details and place order
3. You'll get an Order ID
4. Go to `/track-order` and search by email
5. Go to `/admin/orders` with password `admin123`
6. Update order status and see changes reflected in tracking

## Security Notes

- All passwords for admin are hashed in production (should implement)
- Use environment variables for sensitive data
- Implement Row Level Security (RLS) in Supabase for production
- Add rate limiting to API endpoints
- Validate all input on both frontend and backend
- Use HTTPS in production
- Consider adding email verification

## Future Improvements

1. **Payment Integration**: Add Stripe or Razorpay
2. **Notifications**: Email and SMS integration
3. **Real-time Updates**: WebSocket for live order tracking
4. **Customer Accounts**: Save favorite orders, address book
5. **Analytics**: Dashboard for restaurant owners
6. **Delivery Partner Integration**: Track drivers
7. **Loyalty Program**: Points and rewards system
8. **Multi-language Support**: Support multiple languages
9. **Mobile App**: Native iOS/Android apps
