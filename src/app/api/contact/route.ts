import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define a strict, sanitized validation schema for inbound data packets
const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name exceeds length constraint"),
  email: z.string().trim().email("Invalid email layout structure").max(150),
  subject: z.string().trim().max(200).default("No Subject Specified"),
  message: z.string().trim().min(1, "Message content is required").max(5000, "Message is too long"),
  honeypot: z.any().optional(),
});

export async function POST(request: Request) {
  try {
    // 1. Safe Parse Raw JSON Data Input
    const rawBody = await request.json();
    const result = contactFormSchema.safeParse(rawBody);

    if (!result.success) {
      // Return clear, actionable validation error states to frontend
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { name, email, subject, message, honeypot } = result.data;

    // 2. Honeypot check - Anti-Spam Trap
    if (honeypot) {
      // Silently discard requests coming from simple automation scripts
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 3. Structural Runtime Resolution Guardrail
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!discordWebhookUrl) {
      console.error("Infrastructure Error: DISCORD_WEBHOOK_URL environment variable is undefined.");
      return NextResponse.json({ error: 'Messaging gateway is temporarily offline' }, { status: 500 });
    }

    // 4. Character Cap Enforcer for Discord API limits (Value cannot exceed 1024)
    const secureMessage = message.length > 1000 
      ? `${message.substring(0, 997)}...` 
      : message;

    // 5. Build Sanitized Embed Payload Configuration
    const payload = {
      embeds: [
        {
          title: `💼 New Portfolio Inquiry: ${subject}`,
          color: 0x3b82f6, // Vibrant blueprint UI framing color
          timestamp: new Date().toISOString(),
          fields: [
            { name: "👤 Sender Name", value: name, inline: true },
            { name: "✉️ Sender Email", value: email, inline: true },
            { name: "📝 Message Body", value: secureMessage }
          ]
        }
      ],
      // Crucial Security Layer: Disables payload capability to ping global role handlers or server members
      allowed_mentions: {
        parse: []
      }
    };

    // 6. Execute Network Handshake with Target Endpoint
    const res = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Downstream communication error with Discord Gateway: ${res.status}`);  
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    // Keeps internal logging clean and detailed on server environment terminal
    console.error("Critical error inside contact API edge channel:", error);
    
    // Obfuscates low-level implementation logic from client view
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}