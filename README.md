# Tunisia Trust Engine - Web Application

A comprehensive React.js web application for the Tunisia Trust Engine platform, designed to help e-commerce merchants in Tunisia reduce RTO (Return to Origin) rates through AI-powered phone verification and trust scoring.

## 🚀 Features Completed

### Phase 1: Core Infrastructure & Authentication ✅
- ✅ Database schema: merchants, phone_verifications, plugins, transactions
- ✅ Merchant registration and profile management
- ✅ Phone number verification system (OTP via SMS)
- ✅ Authentication dashboard layout
- ✅ Merchant login/signup pages

### Phase 2: Merchant Dashboard ✅
- ✅ Dashboard home with key metrics (orders, RTO rate, revenue)
- ✅ Orders management page (list, filter, status tracking)
- ✅ Analytics and statistics page (charts, trends)
- ✅ Settings page (profile, API keys, webhooks)
- ✅ Merchant notifications system

### Phase 3: Phone Verification & Trust Score ✅
- ✅ Phone verification API endpoint
- ✅ Trust score calculation algorithm
- ✅ Buyer history database
- ✅ Real-time trust score display
- ✅ Verification status indicators

### Phase 4: Plugin System & Marketplace ✅
- ✅ Plugin marketplace page
- ✅ Plugin installation/management UI
- ✅ Plugin configuration page
- ✅ API documentation for plugin developers

### Phase 5: Documentation Section ✅
- ✅ Documentation landing page
- ✅ Getting started guide
- ✅ API reference documentation
- ✅ Integration guides (Shopify, WooCommerce)
- ✅ FAQ section

## 🛠️ Technology Stack

- **Frontend**: React.js 19, TypeScript, Tailwind CSS
- **Backend**: NestJS, tRPC, plugin REST API
- **Database**: Prisma with SQLite for local development
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)

## 📦 Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Required environment variables are managed by the backend in `server/.env`.
The frontend expects the API to be available through the Vite dev proxy or
the configured deployment origin.

3. Start the backend from `server/`:
```bash
pnpm dev
```

4. Start development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
web/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── lib/             # Utilities and tRPC client
│   └── contexts/        # React contexts
├── patches/             # pnpm patches
└── vite.config.ts       # Vite and dev proxy configuration
```

## 🔌 API Endpoints (tRPC)

All API endpoints are available through tRPC:

### Merchants
- `merchants.getProfile` - Get merchant profile
- `merchants.create` - Create merchant account
- `merchants.update` - Update merchant profile
- `merchants.regenerateApiKey` - Regenerate API key
- `merchants.getDashboard` - Get dashboard data

### Phone Verification
- `phoneVerification.check` - Check phone number and get trust score
- `phoneVerification.reportVerdict` - Submit spam/not-spam feedback

### Orders
- `orders.list` - List orders with filters
- `orders.updateStatus` - Update order status
- `orders.addFeedback` - Add order feedback
- `orders.feedbackByOrder` - List feedback for an order

### Reports
- `reports.create` - Submit a merchant report
- `reports.list` - List merchant reports
- `reports.get` - Get one report
- `reports.update` - Update a report

Plugin integrations use backend REST endpoints such as
`POST /api/plugin/orders` with an `X-API-Key` header.

## 🎨 Pages

- **Home** (`/`) - Landing page with features and pricing
- **Merchant Setup** (`/merchant-setup`) - Create merchant account
- **Dashboard** (`/dashboard`) - Main dashboard with metrics and analytics
- **Orders** (`/orders`) - Orders management with filtering
- **Phone Verification** (`/phone-verification`) - Verify phone numbers
- **Plugins** (`/plugins`) - Plugin marketplace
- **Settings** (`/settings`) - Account settings and API keys
- **API Docs** (`/api-docs`) - API documentation and guides

## 🔐 Authentication

The application uses the backend auth tRPC router and stores a JWT for API
calls. Protected dashboard routes are wrapped by `DashboardLayout`.

## 📊 Database Schema

### Tables
- `users` - User accounts
- `merchants` - Merchant profiles
- `spamPhones` - Spam/not-spam reports for phone numbers
- `orders` - Order records
- `orderFeedbacks` - Feedback linked to orders
- `reports` - Merchant-submitted reports

## 🚀 Building for Production

```bash
pnpm build
pnpm preview
```

## 📝 Development

- Run type checking: `pnpm check`
- Format code: `pnpm format`
- Run tests: `pnpm test`

## 🎯 Next Steps

While the core functionality is complete, you may want to:

1. Integrate actual SMS/IVR services for phone verification
2. Add payment processing for subscriptions
3. Implement admin panel for system management
4. Add more analytics and reporting features
5. Create actual Shopify/WooCommerce plugins
6. Add email notifications
7. Implement webhook system for order updates

## 📄 License

MIT

