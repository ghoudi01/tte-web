/**
 * IA pipeline: Shipping carrier recommendation by region and trust.
 * Aligns with plugins/shipping-selector and RoadmapIdeas "توصية أفضل شركة توصيل".
 * Uses datasets/tunisia-regions for capital vs national coverage.
 */

import { isCapitalRegion } from "../datasets";

export type ShippingInput = {
  trustScore: number;
  region?: string;
  availableCarriers: { name: string; coverage?: string }[];
};

export function selectShippingCarrier(input: ShippingInput): string {
  const carriers = input.availableCarriers;
  const defaultCarrier = carriers[0]?.name ?? "Rapid-Poste";
  if (input.trustScore < 40) return defaultCarrier;
  if (input.region && isCapitalRegion(input.region)) return "Tunisia Express";
  if (
    input.region &&
    input.region.trim().toLowerCase().includes("tunis")
  )
    return "Tunisia Express";
  return defaultCarrier;
}
