import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "hello@faijan.in",
      to: "hello@faijan.in",
      replyTo: email,
      subject: subject ? `Portfolio: ${subject}` : `New message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0f;color:#e5e7eb;padding:32px;border-radius:12px;">
          <h2 style="color:#2563eb;margin:0 0 24px;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;color:#9ca3af;font-size:13px;width:100px;">Name</td>
              <td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#9ca3af;font-size:13px;">Email</td>
              <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#2563eb;font-size:14px;">${email}</a></td>
            </tr>
            ${subject ? `<tr><td style="padding:10px 0;color:#9ca3af;font-size:13px;">Subject</td><td style="padding:10px 0;color:#fff;font-size:14px;">${subject}</td></tr>` : ""}
            <tr>
              <td style="padding:10px 0;color:#9ca3af;font-size:13px;vertical-align:top;">Message</td>
              <td style="padding:10px 0;color:#e5e7eb;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
          <p style="color:#6b7280;font-size:12px;margin:0;">Sent via faijan.in contact form</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
