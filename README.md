# TTE Web Application

React-based frontend for Tunisia Trust Engine. Provides merchant dashboard, order management, phone verification, plugin marketplace, and comprehensive documentation.

## Overview

The web application is the primary interface for merchants to interact with TTE. It features a modern React 19 stack with TypeScript, Vite, and a component library built on Radix UI and shadcn/ui.

## Features

### Merchant Dashboard
- **Metrics Overview** - Orders count, RTO rate, revenue, trust score trends
- **Order Management** - List, filter, and update order verification status
- **Analytics** - Charts and statistics for order patterns and fraud detection
- **Settings** - Profile management, API key regeneration, webhook configuration

### Phone Verification
- **Real-time Verification** - Check customer phone trust scores before shipping
- **Verification History** - Track past verification attempts and outcomes
- **Spam Reporting** - Report fraudulent or spam phone numbers

### Plugin Marketplace
- **Discover Plugins** - Browse available platform integrations
- **Install & Configure** - One-click installation with API key setup
- **Manage Active Plugins** - Enable/disable and configure plugin settings

### Documentation Hub
- **API Reference** - Interactive API documentation
- **Integration Guides** - Step-by-step setup for Shopify, WooCommerce, etc.
- **FAQ** - Common questions and answers

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable UI components built on Radix UI
- **Wouter** - Lightweight client-side router
- **TanStack Query** - Server state management and caching
- **tRPC** - Type-safe API client
- **Recharts** - Charting library for analytics
- **React Hook Form** - Form state management
- **Zod** - Schema validation

## Project Structure

```
web/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components (buttons, cards, etc.)
│   │   ├── layout/          # Layout components (header, sidebar, etc.)
│   │   └── features/        # Feature-specific components
│   ├── pages/               # Page components (route handlers)
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── orders/          # Order management pages
│   │   ├── phone-verification/
│   │   ├── plugins/         # Plugin marketplace
│   │   ├── settings/        # Account settings
│   │   └── api-docs/        # API documentation
│   ├── lib/                 # Utilities and configurations
│   │   ├── trpc/            # tRPC client setup
│   │   ├── api/             # API utilities
│   │   ├── utils/           # Helper functions
│   │   └── constants/       # App constants
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   └── _core/               # Core application logic
├── public/                  # Static assets
├── patches/                 # pnpm patch files
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── package.json            # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- pnpm package manager

### Installation

```bash
cd web
pnpm install
```

### Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

The Vite dev server proxies API requests to the backend at `http://localhost:4000` (configured in `vite.config.ts`).

### Build for Production

```bash
pnpm build
```

Output goes to `web/dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

## Available Scripts

```bash
# Development
pnpm dev              # Start Vite dev server with HMR
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Code Quality
pnpm check            # TypeScript type checking
pnpm lint             # ESLint (if configured)
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run test suite
pnpm test:coverage    # Run tests with coverage

# Utilities
pnpm analyze          # Analyze bundle size
```

## Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Public landing page with features and pricing |
| `/merchant-setup` | MerchantSetup | Register new merchant account |
| `/login` | Login | Merchant sign-in page |
| `/dashboard` | Dashboard | Main dashboard with metrics and analytics |
| `/dashboard/orders` | OrdersPage | Order management and verification |
| `/dashboard/phone-verification` | PhoneVerification | Phone trust score checking |
| `/dashboard/plugins` | PluginsPage | Plugin marketplace |
| `/dashboard/settings` | SettingsPage | Account and API settings |
| `/dashboard/api-docs` | ApiDocsPage | API documentation |
| `/docs` | DocsLanding | Documentation hub |

## State Management

### Server State (TanStack Query)
All server data (merchants, orders, phone verifications) is managed through TanStack Query with tRPC as the data source.

```typescript
import { api } from '@/lib/trpc';

// Example: Fetch merchant profile
const { data: merchant } = api.merchants.getProfile.useQuery();
```

### Client State (React Context)
Global UI state (theme, modals, notifications) uses React Context.

## API Integration

### tRPC Client

The tRPC client is configured in `src/lib/trpc/`:

```typescript
import { api } from '@/lib/trpc';

// Call a tRPC procedure
const result = await api.phoneVerification.check.mutate({
  phoneNumber: '+21698123456'
});
```

### API Base URL

- **Development:** Proxied through Vite dev server to `http://localhost:4000`
- **Production:** Determined by `VITE_API_URL` environment variable or relative path

## UI Components

### shadcn/ui Components

We use shadcn/ui for consistent design. Components are located in `src/components/ui/`:

- Button
- Card
- Input
- Select
- Dialog/Modal
- Toast/Notifications
- Table
- Chart (via Recharts)

### Custom Components

Feature-specific components live in `src/components/features/`:

- `OrderTable` - Orders listing with filters
- `TrustScoreBadge` - Visual trust score indicator
- `PhoneVerificationForm` - Phone check form
- `PluginCard` - Plugin showcase card

## Styling

### Tailwind CSS

All styles use Tailwind utility classes.

```tsx
// Example
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
  Click me
</button>
```

### Custom CSS Variables

Theme colors defined in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}
```

### Dark Mode

The app supports dark mode through CSS variables and class-based toggling.

## Forms

Forms use React Hook Form with Zod validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  phoneNumber: z.string().min(8),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

## Error Handling

### API Errors
tRPC errors are caught by the `TRPCReactError` type and displayed via toast notifications.

### Form Errors
Form validation errors display inline with the input field.

### Global Error Boundary
React Error Boundary catches unexpected errors and displays a fallback UI.

## Testing

```bash
# Run test suite
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch
```

Tests are written with Vitest and React Testing Library.

## Performance

### Code Splitting
Routes are automatically code-split by Vite and Wouter.

### Image Optimization
Static assets in `public/` are served as-is. For optimization, use WebP format and appropriate sizing.

### Bundle Analysis

```bash
pnpm analyze
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow existing code style and conventions
2. Use TypeScript strict mode
3. Write tests for new features
4. Update documentation as needed

See `docs/DEVELOPER_ONBOARDING.md` for full guidelines.

## License

MIT
