"use server";

import { sendEmail } from "@/email";

export async function sendContactEmail(
  email: string,
  name: string,
  message: string
) {
  await sendEmail({
    to: "", // TODO: add vitoro email
    subject: `Contact Page Message - ${name}`,
    html: buildHtml(email, name, message),
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
  });
}

function buildHtml(email: string, name: string, message: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Contact Page Message</h2>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
    </div>
  `;
}
