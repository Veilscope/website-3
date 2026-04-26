import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  topic?: unknown;
  message?: unknown;
};

const jsonHeaders = { "Content-Type": "application/json" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizePlainText(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\0/g, "").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function badRequest(error: string) {
  return new Response(JSON.stringify({ error }), {
    status: 400,
    headers: jsonHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const rawName = typeof body.name === "string" ? body.name : "";
    const rawEmail = typeof body.email === "string" ? body.email : "";
    const rawTopic = typeof body.topic === "string" ? body.topic : "";
    const rawMessage = typeof body.message === "string" ? body.message : "";

    const name = sanitizePlainText(rawName);
    const email = sanitizePlainText(rawEmail).toLowerCase();
    const topic = sanitizePlainText(rawTopic);
    const message = sanitizePlainText(rawMessage);

    if (!name) {
      return badRequest("Name is required.");
    }

    if (name.length > 100) {
      return badRequest("Name is too long.");
    }

    if (!email || !emailPattern.test(email)) {
      return badRequest("Valid email is required.");
    }

    if (email.length > 254) {
      return badRequest("Email is too long.");
    }

    if (!topic) {
      return badRequest("Topic is required.");
    }

    if (topic.length > 150) {
      return badRequest("Topic is too long.");
    }

    if (!message) {
      return badRequest("Message is required.");
    }

    if (message.length > 5000) {
      return badRequest("Message is too long.");
    }

    const requiredEnv = [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_SECURE",
      "SMTP_USER",
      "SMTP_PASS",
      "FROM_EMAIL",
      "FROM_NAME",
      "SUPPORT_TO",
    ] as const;

    const missingEnv = requiredEnv.filter((envName) => !process.env[envName]);
    if (missingEnv.length > 0) {
      console.error("Missing environment variables:", missingEnv);
      return new Response(
        JSON.stringify({ error: "Server configuration error. Please contact support." }),
        { status: 500, headers: jsonHeaders },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const escapedMessage = escapeHtml(message).replace(/\n/g, "<br>");

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: process.env.SUPPORT_TO,
      replyTo: email,
      subject: `New contact form submission: ${topic} from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
             <p><strong>Email:</strong> ${escapeHtml(email)}</p>
             <p><strong>Topic:</strong> ${escapeHtml(topic)}</p>
             <p><strong>Message:</strong></p>
             <p>${escapedMessage}</p>`,
    });

    return new Response(JSON.stringify({ ok: true, message: "Email sent successfully" }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error. Please try again later." }),
      { status: 500, headers: jsonHeaders },
    );
  }
}
