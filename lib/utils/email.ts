import nodemailer from "nodemailer";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }[];
}

/**
 * Sends an email using SMTP config from environment variables.
 * Falls back to local console simulation if env is not configured.
 */
export async function sendEmail(input: SendEmailInput) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP credentials not fully configured. Simulating email sending...");
    console.log("================ SIMULATED EMAIL ================");
    console.log(`To: ${input.to}`);
    console.log(`Subject: ${input.subject}`);
    console.log(`HTML length: ${input.html.length} chars`);
    if (input.attachments) {
      input.attachments.forEach((att) => {
        console.log(`Attachment: ${att.filename} (${att.content.toString().length} chars)`);
      });
    }
    console.log("=================================================");
    return { success: true, simulated: true };
  }

  const smtpSecure = process.env.SMTP_SECURE;
  const secure = smtpSecure !== undefined ? smtpSecure === "true" : port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false // Avoid self-signed certificate failures
    }
  });

  let from = process.env.SMTP_FROM || `"Hệ thống ACW-SRS" <${user}>`;
  if (from && !from.includes("<")) {
    from = `${from} <${user}>`;
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      attachments: input.attachments,
    });
    console.log(`Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email via SMTP:", error);
    return { success: false, error };
  }
}
export type { SendEmailInput };
