// Email templates — plain HTML strings for Resend
// Phase 1: basic templates. Phase 2+: React email components

export function newEnquiryEmail(data: {
  customerName: string
  customerPhone: string
  customerEmail: string | null
  vehicleTitle: string
  message?: string
}): string {
  return `
    <h2>New Enquiry — Auto Alive</h2>
    <p><strong>Customer:</strong> ${data.customerName}</p>
    <p><strong>Phone:</strong> ${data.customerPhone}</p>
    ${data.customerEmail ? `<p><strong>Email:</strong> ${data.customerEmail}</p>` : ''}
    <p><strong>Vehicle:</strong> ${data.vehicleTitle}</p>
    ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
    <hr />
    <p style="color: #888;">Sent from Auto Alive CRM</p>
  `
}

export function enquiryConfirmationEmail(data: {
  customerName: string
  vehicleTitle: string
}): string {
  return `
    <h2>Thank you for your enquiry!</h2>
    <p>Hi ${data.customerName},</p>
    <p>We received your enquiry about the <strong>${data.vehicleTitle}</strong>.</p>
    <p>One of our team members will be in touch shortly.</p>
    <br />
    <p>Kind regards,<br />The Auto Alive Team</p>
  `
}
