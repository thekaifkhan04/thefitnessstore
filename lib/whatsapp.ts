/**
 * WhatsApp Ordering and Enquiry Service for THE FITNESS STORE (TFS)
 */

export interface WhatsAppProductItem {
  id: string;
  name: string;
  sku: string;
  variantName?: string;
  quantity: number;
  unitPricePaise: number;
}

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function cleanWhatsAppNumber(phone?: string): string {
  const fallback = "919876543210";
  const num = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || fallback;
  // Strip all non-digit characters
  const cleaned = num.replace(/\D/g, "");
  // Default to India country code 91 if 10 digits provided
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned || fallback;
}

/**
 * Builds standard WhatsApp click-to-chat URL
 */
export function buildWhatsAppUrl(message: string, customPhone?: string): string {
  const phone = cleanWhatsAppNumber(customPhone);
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * Generates single-product order enquiry message matching Section 9 spec
 */
export function generateSingleProductMessage(
  item: WhatsAppProductItem,
  storeName = "THE FITNESS STORE"
): string {
  const subtotalPaise = item.unitPricePaise * item.quantity;
  const priceFormatted = formatINR(item.unitPricePaise);
  const subtotalFormatted = formatINR(subtotalPaise);

  const lines = [
    `Hello ${storeName}!`,
    ``,
    `I would like to enquire about this product:`,
    ``,
    `Product: ${item.name}`,
    `Product Code: ${item.sku || "N/A"}`,
    `Variant: ${item.variantName || "Standard"}`,
    `Quantity: ${item.quantity}`,
    `Price: ${priceFormatted}`,
    `Subtotal: ${subtotalFormatted}`,
    ``,
    `Please confirm availability and delivery details.`,
  ];

  return lines.join("\n");
}

/**
 * Generates multi-product cart order enquiry message matching Section 9 spec
 */
export function generateCartOrderMessage(
  items: WhatsAppProductItem[],
  options?: {
    reference?: string;
    customerName?: string;
    customerNote?: string;
    storeName?: string;
  }
): string {
  const storeName = options?.storeName || "THE FITNESS STORE";
  const ref = options?.reference;
  const customerName = options?.customerName;
  const note = options?.customerNote;

  let totalPaise = 0;

  const lines: string[] = [
    `Hello ${storeName}!`,
    ``,
    `I would like to place an order enquiry.`,
  ];

  if (ref) {
    lines.push(`Enquiry Ref: ${ref}`);
  }
  if (customerName) {
    lines.push(`Customer: ${customerName}`);
  }

  lines.push(``);

  items.forEach((item, index) => {
    const lineSubtotal = item.unitPricePaise * item.quantity;
    totalPaise += lineSubtotal;

    lines.push(
      `${index + 1}. Product: ${item.name}`,
      `   Code: ${item.sku || "N/A"}`,
      `   Variant: ${item.variantName || "Standard"}`,
      `   Quantity: ${item.quantity}`,
      `   Unit Price: ${formatINR(item.unitPricePaise)}`,
      `   Subtotal: ${formatINR(lineSubtotal)}`,
      ``
    );
  });

  lines.push(`Cart Subtotal: ${formatINR(totalPaise)}`);
  lines.push(``);
  lines.push(`Please confirm availability, delivery charges, and the final order amount.`);

  if (note) {
    lines.push(``, `Special Note: ${note}`);
  }

  lines.push(``, `Thank you!`);

  return lines.join("\n");
}

/**
 * Generates wholesale / bulk enquiry message
 */
export function generateWholesaleMessage(data: {
  name: string;
  organization?: string;
  phone?: string;
  requirement: string;
  category?: string;
}): string {
  const lines = [
    `Hello THE FITNESS STORE!`,
    ``,
    `I would like to make a Wholesale / Bulk Equipment Enquiry:`,
    ``,
    `Contact Name: ${data.name}`,
    data.organization ? `Gym / Business: ${data.organization}` : null,
    data.phone ? `Phone: ${data.phone}` : null,
    data.category ? `Category Interested In: ${data.category}` : null,
    ``,
    `Requirement Details:`,
    `${data.requirement}`,
    ``,
    `Please share your wholesale catalogue, bulk pricing, and delivery timelines.`,
    ``,
    `Thank you!`,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}
