import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendPriceDropEmail = async (userEmail, product, alert) => {
  const mailOptions = {
    from: `"MoneyPrism Alerts" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Price Alert! ${product.name} is in your buy zone!`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .container { border: 1px solid #ddd; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; }
          h1 { color: #2563eb; }
          h3 { margin-top: 0; }
          .product-card { border: 1px solid #eee; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .price { color: #16a34a; font-size: 1.2em; font-weight: bold; }
          .button { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
          .footer { font-size: 0.9em; color: #777; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Price Alert!</h1>
          <p>Great news! The price for a product you are tracking has dropped into your desired price range.</p>
          <hr>
          <div class="product-card">
            <h3>${product.name}</h3>
            <img src="${product.imageURL}" alt="${product.name}" style="max-width: 200px; border-radius: 5px;" />
            
            <p>Current Price: <strong class="price">₹${product.currentLowestPrice.toLocaleString()}</strong></p>
            
            <p>Your Target Range: <strong>₹${alert.targetPriceLow.toLocaleString()} - ₹${alert.targetPriceHigh.toLocaleString()}</strong></p>
            
            <a href="${product.sellers[0]?.productURL}" class="button">
              View Deal Now
            </a>
          </div>
          <hr>
          <p class="footer">Thank you for using MoneyPrism!</p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Price drop email sent to ${userEmail}. Message ID: ${info.messageId}`,
    );
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${userEmail}:`, error);

    throw new Error(`Could not send email. Error: ${error.message}`);
  }
};
