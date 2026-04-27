/// <reference path="./server.d.ts" />

import { factory } from '@/factory';
import { MerchantConfig, PluginConfig } from '@prisma/client';

export interface WebhookSubscription {
  id: string;
  merchantId: string;
  eventType: string;
  url: string;
  secret: string;
  isActive: boolean;
  failureCount: number;
  lastAttemptedAt: Date | null;
  lastDeliveredAt: Date | null;
  createdAt: Date;
}

export interface WebhookDeliveryLog {
  id: string;
  subscriptionId: string;
  payload: Record<string, any>;
  responseStatus: number | null;
  responseBody: string | null;
  errorMessage: string | null;
  attemptedAt: Date;
  succeeded: boolean;
}

export interface WebhookEvent<T = any> {
  id: string;
  type: string;
  timestamp: Date;
  merchantId: string;
  payload: T;
}

export type WebhookEventType =
  | 'order.created'
  | 'order.updated'
  | 'order.spam_reported'
  | 'order.feedback_received'
  | 'verification.completed'
  | 'credit.converted'
  | 'credit.withdrawal_requested'
  | 'referral.activated'
  | 'merchant.created'
  | 'report.submitted'
  | 'report.status_changed';

export interface WebhookManagerConfig {
  retryAttempts: number;
  retryDelayMs: number;
  timeoutMs: number;
  maxPayloadSize: number;
}

export const defaultWebhookConfig: WebhookManagerConfig = {
  retryAttempts: 3,
  retryDelayMs: 5000,
  timeoutMs: 10000,
  maxPayloadSize: 1024 * 1024, // 1MB
};

export class WebhookManager {
  private config: WebhookManagerConfig;

  constructor(config: Partial<WebhookManagerConfig> = {}) {
    this.config = { ...defaultWebhookConfig, ...config };
  }

  /**
   * Create a new webhook subscription
   */
  async createSubscription(input: {
    merchantId: string;
    eventType: WebhookEventType;
    url: string;
    secret?: string;
  }): Promise<WebhookSubscription> {
    if (!input.url.match(/^https?:\/\//)) {
      throw new Error('Invalid webhook URL');
    }

    return factory('WebhookSubscription', {
      merchantId: input.merchantId,
      eventType: input.eventType,
      url: input.url,
      secret: input.secret || factory.generateId(32),
      isActive: true,
      failureCount: 0,
      lastAttemptedAt: null,
      lastDeliveredAt: null,
    });
  }

  /**
   * Queue webhook event for delivery
   */
  async queueEvent(event: WebhookEvent): Promise<void> {
    // Implementation: persist to database for async delivery
    await factory('WebhookQueue', {
      eventId: event.id,
      eventType: event.type,
      merchantId: event.merchantId,
      payload: event.payload,
      queuedAt: new Date(),
      attempts: 0,
    });
  }

  /**
   * Deliver webhook to subscriber URL
   */
  async deliver(subscription: WebhookSubscription, event: WebhookEvent): Promise<boolean> {
    const payload = this.signPayload(event, subscription.secret);
    const signature = this.generateSignature(payload, subscription.secret);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

      const response = await fetch(subscription.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TTE-Event': event.type,
          'X-TTE-Event-ID': event.id,
          'X-TTE-Signature': signature,
          'X-TTE-Delivery': 'webhook-v1',
        },
        body: JSON.stringify(payload, null, 2),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        await this.logDelivery({
          subscriptionId: subscription.id,
          eventId: event.id,
          payload,
          responseStatus: response.status,
          responseBody: await response.text(),
          succeeded: true,
        });

        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      await this.logDelivery({
        subscriptionId: subscription.id,
        eventId: event.id,
        payload,
        errorMessage: error.message,
        succeeded: false,
      });

      return false;
    }
  }

  /**
   * Verify webhook signature from incoming request
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expected = this.generateSignature(JSON.parse(payload), secret);
    return signature === expected;
  }

  /**
   * Generate HMAC signature for payload
   */
  private generateSignature(payload: Record<string, any>, secret: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));
    const key = encoder.encode(secret);

    return crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ).then((cryptoKey) =>
      crypto.subtle.sign('HMAC', cryptoKey, data).then((signature) =>
        btoa(String.fromCharCode(...new Uint8Array(signature)))
      )
    );
  }

  /**
   * Add signature to payload
   */
  private signPayload(event: WebhookEvent, secret: string): Record<string, any> {
    return {
      ...event.payload,
      _tte: {
        eventId: event.id,
        eventType: event.type,
        timestamp: event.timestamp.toISOString(),
        merchantId: event.merchantId,
      },
    };
  }

  /**
   * Log delivery attempt
   */
  private async logDelivery(params: {
    subscriptionId: string;
    eventId: string;
    payload: any;
    responseStatus?: number;
    responseBody?: string;
    errorMessage?: string;
    succeeded: boolean;
  }) {
    await factory('WebhookDeliveryLog', {
      subscriptionId: params.subscriptionId,
      eventId: params.eventId,
      payload: params.payload,
      responseStatus: params.responseStatus ?? null,
      responseBody: params.responseBody ?? null,
      errorMessage: params.errorMessage ?? null,
      attemptedAt: new Date(),
      succeeded: params.succeeded,
    });
  }

  /**
   * Retry failed webhooks
   */
  async retryFailed(): Promise<number> {
    const failedDeliveries = await factory('WebhookQueue', {
      attempts: { $lt: this.config.retryAttempts },
    }).findMany();

    let retriedCount = 0;
    for (const delivery of failedDeliveries) {
      const subscription = await factory('WebhookSubscription').findById(
        delivery.subscriptionId
      );

      if (subscription && subscription.isActive) {
        const event = factory('WebhookEvent', {
          id: delivery.eventId,
          type: delivery.eventType as any,
          timestamp: new Date(delivery.queuedAt),
          merchantId: delivery.merchantId,
          payload: delivery.payload,
        });

        const success = await this.deliver(subscription, event);
        if (success) {
          await factory('WebhookQueue').deleteById(delivery.id);
          retriedCount++;
        } else {
          // Increment attempt count
          await factory('WebhookQueue').updateById(delivery.id, {
            attempts: delivery.attempts + 1,
          });
        }
      }
    }

    return retriedCount;
  }
}
