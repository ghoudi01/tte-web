# TTE — UI Test Pages

## Public Routes (No Auth Required)

| # | Route | Page Component | File |
|---|-------|---------------|------|
| 1 | `/` | Home | `pages/home/index.tsx` |
| 2 | `/login` | Login | `pages/Login.tsx` |
| 3 | `/register` | Register | `pages/Register.tsx` |
| 4 | `/forgot-password` | ForgotPassword | `pages/ForgotPassword.tsx` |
| 5 | `/verify-email` | VerifyEmail | `pages/VerifyEmail.tsx` |
| 6 | `/reset-password` | ResetPassword | `pages/ResetPassword.tsx` |
| 7 | `/terms` | Terms | `pages/Terms.tsx` |
| 8 | `/privacy` | Privacy | `pages/Privacy.tsx` |
| 9 | `/pricing` | Pricing | `pages/Pricing.tsx` |
| 10 | `/pricing/:plan` | Pricing (dynamic) | `pages/Pricing.tsx` |
| 11 | `/api-docs` | ApiDocs | `pages/ApiDocs.tsx` |
| 12 | `/merchant-setup` | MerchantSetup | `pages/MerchantSetup.tsx` |
| 13 | `/plugins/social-sellers` | PluginsSocialSellers | `pages/PluginsSocialSellers.tsx` |
| 14 | `/plugins/social-sellers/trust-layer` | PluginTrustLayer | `pages/PluginTrustLayer.tsx` |
| 15 | `/plugins/social-sellers/meta-setup` | PluginMetaSetup | `pages/PluginMetaSetup.tsx` |
| 16 | `/plugins` | Plugins | `pages/Plugins.tsx` |

## Authenticated Routes (DashboardLayout)

| # | Route | Page Component | File |
|---|-------|---------------|------|
| 17 | `/dashboard` | Dashboard | `pages/Dashboard.tsx` |
| 18 | `/orders` | Orders | `pages/Orders.tsx` |
| 19 | `/products` | Products | `pages/Products.tsx` |
| 20 | `/phone-verification` | PhoneVerification | `pages/PhoneVerification.tsx` |
| 21 | `/phone-verification/history` | PhoneVerificationHistory | `pages/PhoneVerificationHistory.tsx` |
| 22 | `/settings` | Settings | `pages/Settings.tsx` |
| 23 | `/reports` | Reports | `pages/Reports.tsx` |
| 24 | `/reports/new` | Reports | `pages/Reports.tsx` |
| 25 | `/credits` | Credits | `pages/Credits.tsx` |
| 26 | `/credits/history` | Credits | `pages/Credits.tsx` |
| 27 | `/credits/earn` | Credits | `pages/Credits.tsx` |
| 28 | `/referrals` | Referrals | `pages/Referrals.tsx` |
| 29 | `/referrals/users` | Referrals | `pages/Referrals.tsx` |
| 30 | `/referrals/stats` | Referrals | `pages/Referrals.tsx` |
| 31 | `/analytics` | Analytics | `pages/Analytics.tsx` |
| 32 | `/analytics/orders` | Analytics | `pages/Analytics.tsx` |
| 33 | `/analytics/points` | Analytics | `pages/Analytics.tsx` |
| 34 | `/analytics/reports` | Analytics | `pages/Analytics.tsx` |
| 35 | `/admin/reports` | AdminReports | `pages/AdminReports.tsx` |
| 36 | `/subscription` | Subscription | `pages/Subscription.tsx` |
| 37 | `/subscription/upgrade` | Subscription | `pages/Subscription.tsx` |
| 38 | `/subscription/billing` | Subscription | `pages/Subscription.tsx` |
| 39 | `/support` | Support | `pages/Support.tsx` |
| 40 | `/support/contact` | Support | `pages/Support.tsx` |
| 41 | `/support/report` | Support | `pages/Support.tsx` |

## Special Routes

| # | Route | Type | Notes |
|---|-------|------|-------|
| 42 | `/404` | 404 page | Explicit 404 route |
| 43 | `*` (catch-all) | 404 page | Any unmatched route |
| 44 | `/app-auth` | Redirect → `/login` | |
| 45 | `/user-dashboard` | Redirect → `/dashboard` | |
| 46 | `/points` | Redirect → `/credits` | |
| 47 | `/points/convert` | Redirect → `/credits` | |
| 48 | `/points/history` | Redirect → `/credits/history` | |

## Orphaned Pages (Not Routed — Exists on Disk Only)

| # | File | Notes |
|---|------|-------|
| — | `pages/Points.tsx` | Replaced by `/credits` |
| — | `pages/UserDashboard.tsx` | Replaced by `/dashboard` |
| — | `pages/ComponentShowcase.tsx` | Dev only |
| — | `pages/InnovationTrust.tsx` | Archive? |
| — | `pages/InnovationHub.tsx` | Archive? |
| — | `pages/InnovationIntegrations.tsx` | Archive? |
| — | `pages/InnovationGrowth.tsx` | Archive? |

## Home Page Sections (`/`)

| Anchor | Component | File |
|--------|-----------|------|
| — | Navigation | `pages/home/components/Navigation.tsx` |
| — | Hero | `pages/home/components/Hero.tsx` |
| — | TrustBar | `pages/home/components/TrustBar.tsx` |
| `#problem` | Problem | `pages/home/components/Problem.tsx` |
| `#solution` | Solution | `pages/home/components/Solution.tsx` |
| `#how-it-works` | Process | `pages/home/components/Process.tsx` |
| — | Features | `pages/home/components/Features.tsx` |
| — | Testimonials | `pages/home/components/Testimonials.tsx` |
| — | Pricing | `pages/home/components/Pricing.tsx` |
| — | CTA | `pages/home/components/CTA.tsx` |
| — | Contact | `pages/home/components/Contact.tsx` |
| — | Footer | `pages/home/components/Footer.tsx` |

## Registration Sub-Components (used by `/register`)

| Component | File |
|-----------|------|
| Step1Personal | `pages/register/components/Step1Personal.tsx` |
| Step2Company | `pages/register/components/Step2Company.tsx` |
| Step3Products | `pages/register/components/Step3Products.tsx` |
| StepIndicator | `pages/register/components/StepIndicator.tsx` |

---

**Summary:** 48 routes total (43 unique + 5 redirects), 25 unique page components.
