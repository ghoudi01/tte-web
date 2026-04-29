/**
 * IA pipeline: WhatsApp validation message builder.
 * Aligns with plugins/whatsapp-validation and RoadmapIdeas "مساعد واتساب للتحقق".
 */

export type WhatsAppValidationInput = {
  phoneNumber: string;
  orderAmount: number;
};

export function buildWhatsAppValidationMessage(
  input: WhatsAppValidationInput
): string {
  return `مرحباً، لتأكيد طلبك بقيمة ${input.orderAmount} د.ت على الرقم ${input.phoneNumber} يرجى الرد بكلمة: تأكيد`;
}
