import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, honeypot } = body;

    // Honeypot check - anti-spam
    if (honeypot) {
      // Silently drop request for spam bots, return success
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const discordWebhookUrl = "https://discord.com/api/webhooks/1511146706555633765/iZ1-kEtCKhFMAFYdfJtP1GHEA_9sk2KedfgmjgWyaTuFKsbSmszJDIKNOctAH3quM8Xd";

    const payload = {
      embeds: [
        {
          title: `💼 New Portfolio Inquiry: ${subject || 'No Subject'}`,
          color: 0x3b82f6, // Sleek hex color matching UI
          timestamp: new Date().toISOString(),
          fields: [
            { name: "👤 Sender Name", value: name, inline: true },
            { name: "✉️ Sender Email", value: email, inline: true },
            { name: "📝 Message Body", value: message }
          ]
        }
      ]
    };

    const res = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Discord API error: ${res.status}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Error sending message to Discord:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
