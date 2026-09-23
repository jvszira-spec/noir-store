import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"NOIR Tobacco" <${process.env.SMTP_USER ?? "noreply@noir-store.com"}>`;
const BRAND_RED = "#880A25";
const BRAND_CREAM = "#FFFFF8";

function baseLayout(title: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:${BRAND_CREAM};border:1px solid #EADCDF;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0D0D0D;padding:28px 40px;text-align:center;">
            <span style="font-family:Georgia,serif;font-size:28px;font-weight:600;letter-spacing:0.3em;color:#E8E3DD;">NOIR</span>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:40px;">${body}</td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0D0D0D;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.15em;color:#9A9590;">NOIR TOBACCO — CANADA</p>
            <p style="margin:0 0 6px;font-size:11px;color:#6A6560;">support@noir-store.com</p>
            <p style="margin:0;font-size:10px;color:#4A4540;">For adults 19+ only · Not for sale to minors · Canada only</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function statusBadge(label: string, color: string) {
  return `<span style="display:inline-block;background:${color};color:#fff;font-size:10px;font-weight:700;letter-spacing:0.15em;padding:4px 12px;">${label}</span>`;
}

function itemsTable(items: { name: string; brand?: string | null; quantity: number; price: number }[]) {
  const rows = items.map((i) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #EADCDF;font-size:13px;color:#2F1820;">${i.name}${i.brand ? `<br/><span style="font-size:11px;color:#9A9590;">${i.brand}</span>` : ""}</td>
      <td style="padding:10px 0;border-bottom:1px solid #EADCDF;font-size:13px;color:#2F1820;text-align:center;">×${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #EADCDF;font-size:13px;color:${BRAND_RED};text-align:right;">$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`).join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EADCDF;margin-top:8px;">
    <tr>
      <th style="padding:8px 0;font-size:9px;letter-spacing:0.15em;color:#9A9590;text-align:left;font-weight:600;">ITEM</th>
      <th style="padding:8px 0;font-size:9px;letter-spacing:0.15em;color:#9A9590;text-align:center;font-weight:600;">QTY</th>
      <th style="padding:8px 0;font-size:9px;letter-spacing:0.15em;color:#9A9590;text-align:right;font-weight:600;">PRICE</th>
    </tr>
    ${rows}
  </table>`;
}

// ─── Email 1: Order Confirmed ───────────────────────────────────────────────
export async function sendOrderConfirmedEmail(order: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: { name: string; brand?: string | null; quantity: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress?: { address1: string; address2?: string | null; city: string; state: string; postalCode: string } | null;
}) {
  const body = `
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.15em;color:#9A9590;">ORDER CONFIRMED</p>
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:400;color:#2F1820;">Thank You, ${order.customerName.split(" ")[0]}!</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6A6560;line-height:1.6;">We've received your order and are preparing it for dispatch. You'll get another email as soon as it ships.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F5;border:1px solid #EADCDF;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <table width="100%"><tr>
            <td><p style="margin:0;font-size:10px;letter-spacing:0.1em;color:#9A9590;">ORDER</p><p style="margin:4px 0 0;font-size:13px;font-weight:600;color:${BRAND_RED};">${order.orderNumber}</p></td>
            <td style="text-align:right;">${statusBadge("CONFIRMED", "#2D6A2D")}</td>
          </tr></table>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.15em;color:#9A9590;">ITEMS ORDERED</p>
    ${itemsTable(order.items)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr><td style="padding:4px 0;font-size:13px;color:#6A6560;">Subtotal</td><td style="text-align:right;font-size:13px;color:#2F1820;">$${order.subtotal.toFixed(2)}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#6A6560;">Shipping</td><td style="text-align:right;font-size:13px;color:#2F1820;">$${order.shippingCost.toFixed(2)}</td></tr>
      <tr><td style="padding:8px 0 4px;font-size:14px;font-weight:700;color:#2F1820;border-top:1px solid #EADCDF;">Total</td><td style="text-align:right;font-size:14px;font-weight:700;color:${BRAND_RED};border-top:1px solid #EADCDF;">$${order.total.toFixed(2)}</td></tr>
    </table>

    ${order.shippingAddress ? `
    <div style="margin-top:24px;padding:16px;background:#F8F7F5;border:1px solid #EADCDF;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.15em;color:#9A9590;">DELIVERING TO</p>
      <p style="margin:0;font-size:13px;color:#2F1820;line-height:1.7;">
        ${order.shippingAddress.address1}${order.shippingAddress.address2 ? ", " + order.shippingAddress.address2 : ""}<br/>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
      </p>
    </div>` : ""}
  `;

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Order Confirmed — ${order.orderNumber} | NOIR`,
    html: baseLayout("Order Confirmed | NOIR", body),
  });
}

// ─── Email 2: Order Shipped ─────────────────────────────────────────────────
export async function sendOrderShippedEmail(order: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingNumber?: string | null;
  items: { name: string; brand?: string | null; quantity: number; price: number }[];
  total: number;
  shippingAddress?: { address1: string; address2?: string | null; city: string; state: string; postalCode: string } | null;
}) {
  const body = `
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.15em;color:#9A9590;">YOUR ORDER IS ON ITS WAY</p>
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:400;color:#2F1820;">It's Been Shipped!</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6A6560;line-height:1.6;">Great news — your order has left our warehouse and is on its way to you.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F5;border:1px solid #EADCDF;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <table width="100%"><tr>
            <td><p style="margin:0;font-size:10px;letter-spacing:0.1em;color:#9A9590;">ORDER</p><p style="margin:4px 0 0;font-size:13px;font-weight:600;color:${BRAND_RED};">${order.orderNumber}</p></td>
            <td style="text-align:right;">${statusBadge("SHIPPED", "#1A5F8A")}</td>
          </tr></table>
        </td>
      </tr>
    </table>

    ${order.trackingNumber ? `
    <div style="margin-bottom:24px;padding:20px;background:#EEF5FB;border:1px solid #BDDAF0;text-align:center;">
      <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.15em;color:#1A5F8A;">TRACKING NUMBER</p>
      <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.1em;color:#0D3A57;">${order.trackingNumber}</p>
      <p style="margin:8px 0 0;font-size:11px;color:#6A6560;">Use this number on your carrier's website to track your package</p>
    </div>` : `
    <div style="margin-bottom:24px;padding:16px;background:#F8F7F5;border:1px solid #EADCDF;">
      <p style="margin:0;font-size:13px;color:#6A6560;">Tracking information will be available shortly. Check back in a few hours.</p>
    </div>`}

    <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.15em;color:#9A9590;">ITEMS IN THIS SHIPMENT</p>
    ${itemsTable(order.items)}

    ${order.shippingAddress ? `
    <div style="margin-top:24px;padding:16px;background:#F8F7F5;border:1px solid #EADCDF;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.15em;color:#9A9590;">DELIVERING TO</p>
      <p style="margin:0;font-size:13px;color:#2F1820;line-height:1.7;">
        ${order.shippingAddress.address1}${order.shippingAddress.address2 ? ", " + order.shippingAddress.address2 : ""}<br/>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
      </p>
    </div>` : ""}
  `;

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Your Order Has Shipped — ${order.orderNumber} | NOIR`,
    html: baseLayout("Order Shipped | NOIR", body),
  });
}

// ─── Email 3: Order Delivered ───────────────────────────────────────────────
export async function sendOrderDeliveredEmail(order: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: { name: string; brand?: string | null; quantity: number; price: number }[];
}) {
  const body = `
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.15em;color:#9A9590;">DELIVERY COMPLETE</p>
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:400;color:#2F1820;">Your Order Has Arrived!</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6A6560;line-height:1.6;">Your order has been delivered. We hope you enjoy your purchase. If there's any issue, don't hesitate to contact us at support@noir-store.com.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F5;border:1px solid #EADCDF;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <table width="100%"><tr>
            <td><p style="margin:0;font-size:10px;letter-spacing:0.1em;color:#9A9590;">ORDER</p><p style="margin:4px 0 0;font-size:13px;font-weight:600;color:${BRAND_RED};">${order.orderNumber}</p></td>
            <td style="text-align:right;">${statusBadge("DELIVERED", "#2D6A2D")}</td>
          </tr></table>
        </td>
      </tr>
    </table>

    ${itemsTable(order.items)}

    <div style="margin-top:28px;padding:20px;background:#F8F7F5;border-left:3px solid ${BRAND_RED};text-align:center;">
      <p style="margin:0 0 6px;font-size:13px;color:#2F1820;font-weight:600;">Enjoyed your order?</p>
      <p style="margin:0;font-size:13px;color:#6A6560;">Leave a review on our website — it helps other customers find the right product.</p>
    </div>
  `;

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Your Order Has Been Delivered — ${order.orderNumber} | NOIR`,
    html: baseLayout("Order Delivered | NOIR", body),
  });
}

// ─── Email 4: Order Cancelled ───────────────────────────────────────────────
export async function sendOrderCancelledEmail(order: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  total: number;
}) {
  const body = `
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.15em;color:#9A9590;">ORDER UPDATE</p>
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:400;color:#2F1820;">Order Cancelled</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6A6560;line-height:1.6;">Your order <strong>${order.orderNumber}</strong> has been cancelled. If a payment was taken, a refund will be processed within 5–7 business days to your original payment method.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F5;border:1px solid #EADCDF;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <table width="100%"><tr>
            <td><p style="margin:0;font-size:10px;letter-spacing:0.1em;color:#9A9590;">ORDER</p><p style="margin:4px 0 0;font-size:13px;font-weight:600;color:${BRAND_RED};">${order.orderNumber}</p></td>
            <td style="text-align:right;">${statusBadge("CANCELLED", "#8A3A1A")}</td>
          </tr></table>
        </td>
      </tr>
    </table>

    <p style="font-size:13px;color:#6A6560;">If you have any questions, please contact us at <a href="mailto:support@noir-store.com" style="color:${BRAND_RED};">support@noir-store.com</a>.</p>
  `;

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Order Cancelled — ${order.orderNumber} | NOIR`,
    html: baseLayout("Order Cancelled | NOIR", body),
  });
}
