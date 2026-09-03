import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
  turnstileToken: z.string().nullable().optional(),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const fallbackRateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

function isFallbackRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = fallbackRateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  fallbackRateLimitMap.set(ip, validTimestamps);
  return false;
}

async function checkAndLogRateLimit(
  clientIp: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<boolean> {
  const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex");

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const tenMinutesAgo = new Date(
        Date.now() - RATE_LIMIT_WINDOW_MS,
      ).toISOString();
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      supabase
        .from("contact_rate_limits")
        .delete()
        .lt("created_at", oneHourAgo)
        .then(({ error }) => {
          if (error) console.warn("[Rate Limit Cleanup Warning]", error);
        });

      const { data, error } = await supabase
        .from("contact_rate_limits")
        .select("id")
        .eq("ip_hash", ipHash)
        .gte("created_at", tenMinutesAgo);

      if (!error && data) {
        if (data.length >= MAX_REQUESTS_PER_WINDOW) {
          return true;
        }

        await supabase
          .from("contact_rate_limits")
          .insert([{ ip_hash: ipHash }]);
        return false;
      }
    } catch (err) {
      console.warn(
        "[Rate Limiter] Supabase rate check error, falling back to in-memory:",
        err,
      );
    }
  }

  return isFallbackRateLimited(clientIp);
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = (
      forwardedFor?.split(",")[0] ||
      realIp ||
      "127.0.0.1"
    ).trim();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const body = await request.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      const flattened = parseResult.error.flatten();
      return NextResponse.json(
        {
          error: "Invalid form input. Please check the fields below.",
          fieldErrors: flattened.fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, message, turnstileToken } = parseResult.data;

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error("[Turnstile] TURNSTILE_SECRET_KEY is missing.");
      return NextResponse.json(
        { error: "Contact verification is temporarily unavailable." },
        { status: 503 },
      );
    }

    if (!turnstileToken) {
      return NextResponse.json(
        {
          error:
            "Verification token missing. Please complete Turnstile verification.",
        },
        { status: 400 },
      );
    }

    try {
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
          }),
        },
      );

      if (!verifyRes.ok) {
        console.error("[Turnstile Verification HTTP Error]", verifyRes.status);
        return NextResponse.json(
          { error: "Verification failed, please try again." },
          { status: 400 },
        );
      }

      const verifyData: unknown = await verifyRes.json();
      if (
        typeof verifyData !== "object" ||
        verifyData === null ||
        !("success" in verifyData) ||
        verifyData.success !== true
      ) {
        console.warn("[Turnstile Verification Failed]");
        return NextResponse.json(
          { error: "Verification failed, please try again." },
          { status: 400 },
        );
      }
    } catch (err) {
      console.error("[Turnstile Verification Fetch Error]", err);
      return NextResponse.json(
        { error: "Verification failed, please try again." },
        { status: 400 },
      );
    }

    const rateLimited = await checkAndLogRateLimit(
      clientIp,
      supabaseUrl,
      supabaseKey,
    );

    if (rateLimited) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 },
      );
    }

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error: dbError } = await supabase
          .from("contact_messages")
          .insert([
            {
              name,
              email,
              message,
              is_read: false,
            },
          ]);

        if (dbError) {
          console.error("[Supabase Insert Error]", dbError);
        }
      } catch (dbErr) {
        console.error("[Supabase Client Connection Error]", dbErr);
      }
    } else {
      console.warn(
        "[Supabase] Configuration missing. Skipping database record.",
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const destinationEmail =
      process.env.CONTACT_DESTINATION_EMAIL || "dev.akioxz@gmail.com";

    if (!resendApiKey) {
      console.warn(
        "[Resend] RESEND_API_KEY missing. Message saved to DB only.",
      );
      return NextResponse.json({
        success: true,
        message: "Message received! I'll get back to you soon.",
      });
    }

    const resend = new Resend(resendApiKey);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    const notificationPromise = resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [destinationEmail],
      subject: `New portfolio message from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="border-bottom: 2px solid #0070f3; padding-bottom: 8px; margin-top: 0;">New Portfolio Message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 16px; border-left: 4px solid #0070f3; border-radius: 4px; font-size: 14px; white-space: pre-wrap;">
            ${safeMessage}
          </div>
          <hr style="margin-top: 24px; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 11px; color: #777;">Sent from portfolio contact form modal.</p>
        </div>
      `,
    });

    const autoReplyPromise = resend.emails.send({
      from: "Axel Villanueva <onboarding@resend.dev>",
      to: [email],
      subject: `Thanks for reaching out, ${name}!`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #222; max-w: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <p style="font-size: 15px;">Hi ${safeName},</p>
          <p style="font-size: 14px; color: #444;">Thanks for reaching out! I've received your message and I'll get back to you soon — usually within a day or two.</p>
          <p style="font-size: 14px; color: #111; margin-top: 20px;">— Axel</p>
        </div>
      `,
    });

    const [notificationResult, autoReplyResult] = await Promise.allSettled([
      notificationPromise,
      autoReplyPromise,
    ]);

    if (notificationResult.status === "rejected") {
      console.error("[Resend Notification Failed]", notificationResult.reason);
      return NextResponse.json(
        {
          error:
            "Failed to send notification email. Please try again or email directly.",
        },
        { status: 500 },
      );
    }

    if (autoReplyResult.status === "rejected") {
      console.warn(
        "[Resend Auto-Reply Failed (Note: onboarding@resend.dev requires verified domain for strangers)]",
        autoReplyResult.reason,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent! I'll get back to you soon.",
    });
  } catch (error: any) {
    console.error("[Contact API Unexpected Error]", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong — try emailing me directly at dev.akioxz@gmail.com instead.",
      },
      { status: 500 },
    );
  }
}
