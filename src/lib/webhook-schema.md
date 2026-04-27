# Webhook System - Database Schema

## 1. WebhookSubscription Model

```prisma
model WebhookSubscription {
  id             String    @id @default(uuid())
  merchantId     String
  eventTypes     Json      // ["order.created", "order.updated", ...]
  url            String    @db.VarChar(512)
  secret         String    @db.VarChar(64) // HMAC secret
  isActive       Boolean   @default(true)
  failureCount   Int       @default(0)
  lastAttemptedAt DateTime?
  lastDeliveredAt DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@unique([merchantId, url])
  @@index([merchantId])
  @@index([isActive])
  @@index([lastAttemptedAt])
}
```

## 2. WebhookQueue Model (Pending Deliveries)

```prisma
model WebhookQueue {
  id            String    @id @default(uuid())
  eventId       String    @unique
  eventType     String    @db.VarChar(100)
  merchantId    String
  payload       Json
  queuedAt      DateTime  @default(now())
  attempts      Int       @default(0)
  lastError     String?

  @@index([merchantId])
  @@index([queuedAt])
  @@index([attempts])
  @@index([eventType])
}
```

## 3. WebhookDeliveryLog Model (History)

```prisma
model WebhookDeliveryLog {
  id                String    @id @default(uuid())
  subscriptionId    String?
  eventId           String
  payload           Json
  responseStatus    Int?
  responseBody      String?   @db.Text
  errorMessage      String?
  attemptedAt      DateTime  @default(now())
  succeeded         Boolean

  @@index([eventId])
  @@index([subscriptionId])
  @@index([attemptedAt])
  @@index([succeeded])
}
```

## 4. WebhookSignature Model (Verification Tokens)

```prisma
model WebhookSignature {
  id          String   @id @default(uuid())
  merchantId  String
  provider    String   // "meta", "shopify", "woocommerce", "zapier", "custom"
  secret      String   @db.VarChar(128)
  token       String   @unique @db.VarChar(128)
  createdAt   DateTime @default(now())

  @@unique([merchantId, provider])
}
```

---

## REST Endpoints to Implement

### POST `/api/webhooks/subscriptions` - Create webhook

```json
{
  "eventType": "order.created",
  "url": "https://myapp.com/webhooks/tte"
}
```

Response:
```json
{
  "success": true,
  "subscription": { "id": "...", "secret": "..." }
}
```

### GET `/api/webhooks/subscriptions` - List subscriptions

### PUT `/api/webhooks/subscriptions/:id` - Update

### DELETE `/api/webhooks/subscriptions/:id` - Delete

### GET `/api/webhooks/delivery-logs` - View delivery history

### POST `/api/webhooks/test` - Test webhook delivery

---

## Event Types to Support

- `order.created` - When new order placed
- `order.updated` - Status changed
- `order.spam_reported` - Spam report submitted
- `order.feedback_received` - Merchant adds feedback
- `verification.completed` - Phone verification done
- `credit.converted` - Points converted to money
- `credit.withdrawal_requested` - Payout requested
- `referral.activated` - Referral completed
- `merchant.created` - New merchant signed up
- `report.submitted` - New issue report filed
- `report.status_changed` - Report reviewed

---

## Payload Format

```json
{
  "eventId": "evt_123",
  "eventType": "order.created",
  "timestamp": "2026-04-26T10:00:00Z",
  "merchantId": "merchant_abc",
  "payload": {
    "order": { ... },
    "changes": { ... }
  },
  "signature": "HMAC-SHA256(...)"
}
```
