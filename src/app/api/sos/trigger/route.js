import { apiJson, handleApiError, requireSession } from '@/lib/api-helpers';
import { createSosEvent } from '@/lib/services/sos-service';
import { sendSOS } from '@/lib/sendSOS';

/**
 * POST /api/sos/trigger
 *
 * SOS trigger endpoint:
 * 1. Authenticates user
 * 2. Creates SOS record in DB
 * 3. Returns trusted contacts + message data for WhatsApp (frontend handles messaging)
 *
 * Body:
 * - latitude: number (required, -90 to 90)
 * - longitude: number (required, -180 to 180)
 */
export async function POST(request) {
  try {
    const session = await requireSession(
      'Unauthorized. Please log in to trigger SOS.'
    );

    const body = await request.json();
    const { latitude, longitude } = body;

    // --- Validation ---
    if (latitude === undefined || longitude === undefined) {
      return apiJson({ error: 'Latitude and longitude are required' }, 400);
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return apiJson(
        { error: 'Latitude and longitude must be numbers' },
        400
      );
    }

    if (latitude < -90 || latitude > 90) {
      return apiJson({ error: 'Latitude must be between -90 and 90' }, 400);
    }

    if (longitude < -180 || longitude > 180) {
      return apiJson(
        { error: 'Longitude must be between -180 and 180' },
        400
      );
    }

    // --- 1. Create SOS event in DB ---
    const sosEvent = await createSosEvent({
      userId: session.user.id,
      latitude,
      longitude,
    });

    // --- 2. Fetch trusted contacts for WhatsApp ---
    let sosData;
    try {
      sosData = await sendSOS({
        userId: session.user.id,
        latitude,
        longitude,
      });
      console.log('[SOS Trigger] Contacts fetched:', JSON.stringify(sosData));
    } catch (fetchError) {
      console.error('[SOS Trigger] Error fetching contacts:', fetchError);
      sosData = {
        success: false,
        message: fetchError.message || 'Failed to fetch contacts',
        contacts: [],
        contactCount: 0,
        userName: session.user.name || 'A Kavach user',
      };
    }

    // --- 3. Return SOS event + contacts for frontend WhatsApp handling ---
    return apiJson(
      {
        message: sosData.success
          ? `SOS recorded! ${sosData.contactCount} contact(s) ready for WhatsApp alert.`
          : sosData.rateLimited
          ? sosData.message
          : sosData.message,
        sos: {
          id: sosEvent._id.toString(),
          latitude: sosEvent.latitude,
          longitude: sosEvent.longitude,
          status: sosEvent.status,
          createdAt: sosEvent.createdAt,
        },
        // Contacts + user info for WhatsApp deep links (frontend uses this)
        contacts: sosData.contacts || [],
        userName: sosData.userName || session.user.name || 'A Kavach user',
        contactCount: sosData.contactCount || 0,
      },
      201
    );
  } catch (error) {
    console.error('[SOS Trigger] Error:', error);
    return handleApiError(
      error,
      'Failed to trigger SOS alert. Please try again.',
      500
    );
  }
}
