import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    orderId: string;
    items: any[];
    total: number;
    shippingAddress: any;
  }
) {
  const itemsList = orderDetails.items
    .map(
      (item) =>
        `<li>${item.productName} x ${item.quantity} - $${(
          item.price * item.quantity
        ).toFixed(2)}</li>`
    )
    .join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Order Confirmation - Bean Haven Café #${orderDetails.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #43302b;">Thank You for Your Order!</h1>
        <p>Your order has been confirmed and is being processed.</p>
        
        <h2 style="color: #977669;">Order Details:</h2>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        
        <h3>Items:</h3>
        <ul>${itemsList}</ul>
        
        <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
        
        <h3>Shipping Address:</h3>
        <p>
          ${orderDetails.shippingAddress.fullName}<br/>
          ${orderDetails.shippingAddress.address}<br/>
          ${orderDetails.shippingAddress.city}, ${
      orderDetails.shippingAddress.postalCode
    }<br/>
          ${orderDetails.shippingAddress.country}<br/>
          ${orderDetails.shippingAddress.phone}
        </p>
        
        <p>You will receive another email when your order ships.</p>
        
        <p style="color: #977669;">
          Thank you for choosing Bean Haven Café!<br/>
          <em>Your neighborhood coffee haven</em>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    replyTo: data.email,
    subject: `Contact Form: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br/>')}</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
