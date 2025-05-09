import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/shared/libs/db';
import Subscriber from '@/models/subscriber.model';
import { sendEmail } from '@/shared/utils/email.sender';

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const subscribers = await Subscriber.find({ status: 'Subscribed' });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No subscribers found.' }, { status: 404 });
    }

    const userEmails = subscribers.map(sub => sub.email);
    const { subject, htmlContent, contentJson, newsLetterOwnerId, campaign, category } = await req.json();

    if (!subject || !htmlContent || !contentJson || !newsLetterOwnerId) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, htmlContent, contentJson, or newsLetterOwnerId.' },
        { status: 400 }
      );
    }

    // Send email to all subscribers
    const result = await sendEmail({
      userEmail: userEmails,
      subject,
      content: htmlContent,
      contentJson,
      newsLetterOwnerId,
      campaign, // optional
      category, // optional
      emailId: ''
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: result.messageId }, { status: 200 });

  } catch (err) {
    console.error('Error sending bulk email:', err);
    return NextResponse.json({ error: 'Failed to send bulk email.' }, { status: 500 });
  }
}
