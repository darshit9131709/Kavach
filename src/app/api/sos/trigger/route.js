import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/api-helpers';
import connectDB from '@/lib/mongodb';
import TrustedContact from '@/models/TrustedContact';
import { sendAlertEmails } from '@/lib/ses';

export async function POST(request) {
  try {
    const session = await requireSession('Unauthorized');
    const userId = session.user.id;

    await connectDB();

    const contacts = await TrustedContact.find({ userId }).lean();

    if (contacts.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No trusted contacts found. Please add contacts first.',
      }, { status: 400 });
    }

    const emails = contacts.map(c => c.email).filter(Boolean);
    const phones = contacts.map(c => c.phone).filter(Boolean);

    const emergencyContext = `SOS BUTTON MANUALLY ACTIVATED by ${session.user.name || session.user.email} at ${new Date().toUTCString()}. This is a real emergency — the user pressed and held the SOS button. Please call them immediately.`;

    const promises = [];

    if (emails.length > 0) {
      promises.push(sendAlertEmails(emails, emergencyContext));
    }

    if (phones.length > 0) {
      const { sendAlertSMS } = await import('@/lib/sns');
      promises.push(sendAlertSMS(phones, emergencyContext));
    }

    await Promise.all(promises);

    console.log(`[SOS] Manual SOS triggered by user ${userId}. Alerted ${contacts.length} contacts.`);

    return NextResponse.json({
      success: true,
      message: `Emergency alerts sent to ${contacts.length} trusted contact(s).`,
      alertedCount: contacts.length,
    });
  } catch (error) {
    console.error('[SOS] Direct trigger error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send SOS alerts.' }, { status: 500 });
  }
}
