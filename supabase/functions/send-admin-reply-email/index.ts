// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("ADMIN_REPLY_FROM_EMAIL") || "Villa Blue Summer <onboarding@resend.dev>";
  const forcedTestRecipient = Deno.env.get("ADMIN_REPLY_TEST_TO_EMAIL")?.trim() || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse({ error: "Supabase environment is not configured" }, 500);
  }

  if (!resendApiKey) {
    return jsonResponse({ error: "Email provider is not configured (RESEND_API_KEY missing)" }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Missing authorization" }, 401);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader
      }
    }
  });

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const { data: roleRow, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleError || roleRow?.role !== "admin") {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  const payload = await req.json().catch(() => null);
  const requestedToEmail = payload?.toEmail ? String(payload.toEmail).trim() : "";
  const toEmail = forcedTestRecipient || requestedToEmail;
  const guestName = payload?.guestName ? String(payload.guestName).trim() : "Guest";
  const subject = payload?.subject ? String(payload.subject).trim() : "Your message to Villa Blue Summer";
  const adminReply = payload?.adminReply ? String(payload.adminReply).trim() : "";

  if (!toEmail || !adminReply) {
    return jsonResponse({ error: "toEmail and adminReply are required" }, 400);
  }

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
      <p>Hello ${escapeHtml(guestName)},</p>
      <p>We have replied to your message about <strong>${escapeHtml(subject)}</strong>:</p>
      <blockquote style="margin: 16px 0; padding: 12px 16px; border-left: 4px solid #3F9AAE; background: #f8fafc;">
        ${escapeHtml(adminReply).replaceAll("\n", "<br>")}
      </blockquote>
      <p>Best regards,<br>Villa Blue Summer Team</p>
    </div>
  `;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `Villa Blue Summer reply: ${subject}`,
      html
    })
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    return jsonResponse({ error: `Email send failed: ${errorText}` }, 502);
  }

  return jsonResponse({
    success: true,
    deliveredTo: toEmail,
    testMode: Boolean(forcedTestRecipient)
  });
});
