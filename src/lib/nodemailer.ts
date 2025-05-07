import nodemailer from 'nodemailer';

// Send Magic Link Email
export const sendMagicLink = async (email: string, magicLink: string) => {
 // Looking to send emails in production? Check out our Email API/SMTP product!
let transporter = nodemailer.createTransport({
  service: "gmail", // Correct host for Gmail
  port: 465, // Default port for TLS
  secure: true, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

  const mailOptions = {
    from: process.env.EMAIL_FROM,  // From email address
    to: email,  // Recipient email address
    subject: 'Your Magic Login Link',  // Email subject
    text: `Sign in to your account using this link: ${magicLink}`,  // Text content
    html: `<p>Sign in to your account by clicking <a href="${magicLink}">this link</a>.</p>`,  // HTML content
  };

  try {
    // Send the email with transporter.sendMail
    await transporter.sendMail(mailOptions);
    console.log("Magic link sent successfully to:", email);
  } catch (error) {
    console.error("Error sending magic link:", error);
    throw new Error("Error sending email");
  }
};
