import { apiJson, handleApiError, requireSession } from '@/lib/api-helpers';
import { createSosEvent, listSosEventsForUser } from '@/lib/services/sos-service';
import connectDB from '@/lib/mongodb';
import TrustedContact from '@/models/TrustedContact';
import { sendAlertEmails } from '@/lib/ses';

/**
 * POST /api/sos
 * Create a new SOS emergency event + dispatch email/SMS alerts with live location
 */
export async function POST(request) {
  try {
    const session = await requireSession('Unauthorized. Please log in to continue.');

    const body = await request.json();
    const { latitude, longitude } = body;

    // Validation
    if (latitude === undefined || longitude === undefined) {
      return apiJson({ error: 'Latitude and longitude are required' }, 400);
    }
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return apiJson({ error: 'Latitude and longitude must be numbers' }, 400);
    }
    if (latitude < -90 || latitude > 90) {
      return apiJson({ error: 'Latitude must be between -90 and 90' }, 400);
    }
    if (longitude < -180 || longitude > 180) {
      return apiJson({ error: 'Longitude must be between -180 and 180' }, 400);
    }

    // Save SOS event to DB
    const sosEvent = await createSosEvent({
      userId: session.user.id,
      latitude,
      longitude,
    });

    // Build live Google Maps link with exact coordinates
    const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    const emergencyContext = `SOS ALERT from ${session.user.name || session.user.email} at ${new Date().toUTCString()}.\n\nLive Location: ${mapsLink}\nCoordinates: ${latitude}, ${longitude}\n\nThis is a real emergency — they pressed and held the SOS button. Please call them immediately.`;

    // Dispatch alerts — non-blocking so SOS response is always returned fast
    try {
      await connectDB();
      const contacts = await TrustedContact.find({ userId: session.user.id }).lean();

      if (contacts.length > 0) {
        const emails = contacts.map(c => c.email).filter(Boolean);
        const phones = contacts.map(c => c.phone).filter(Boolean);
        const alertPromises = [];

        if (emails.length > 0) {
          alertPromises.push(sendAlertEmails(emails, emergencyContext));
        }
        if (phones.length > 0) {
          const { sendAlertSMS } = await import('@/lib/sns');
          alertPromises.push(sendAlertSMS(phones, emergencyContext));
        }

        await Promise.all(alertPromises);
        console.log(`[SOS] ✅ Alerts dispatched to ${contacts.length} contacts for user ${session.user.id}`);
      } else {
        console.log(`[SOS] ⚠️ No trusted contacts found for user ${session.user.id}`);
      }
    } catch (alertErr) {
      // Never block the SOS response if alerts fail
      console.error('[SOS] Alert dispatch failed (non-fatal):', alertErr.message);
    }

    return apiJson(
      {
        message: 'SOS alert has been sent successfully',
        sos: {
          id: sosEvent._id.toString(),
          latitude: sosEvent.latitude,
          longitude: sosEvent.longitude,
          status: sosEvent.status,
          createdAt: sosEvent.createdAt,
        },
      },
      201
    );
  } catch (error) {
    console.error('SOS creation error:', error);
    return handleApiError(error, 'Failed to create SOS alert. Please try again.', 500);
  }
}

/**
 * GET /api/sos
 * Get user's SOS event history
 */
export async function GET(request) {
  try {
    const session = await requireSession('Unauthorized');

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sosEvents = await listSosEventsForUser({
      userId: session.user.id,
      status,
    });

    return apiJson({
      sosEvents: sosEvents.map((event) => ({
        id: event._id.toString(),
        latitude: event.latitude,
        longitude: event.longitude,
        status: event.status,
        createdAt: event.createdAt,
      })),
    });
  } catch (error) {
    console.error('SOS fetch error:', error);
    return handleApiError(error, 'Failed to fetch SOS events', 500);
  }
}
