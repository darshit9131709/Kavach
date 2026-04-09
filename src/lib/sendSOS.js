import connectDB from '@/lib/mongodb';
import TrustedContact from '@/models/TrustedContact';
import User from '@/models/User';

/**
 * In-memory rate limiter to prevent SOS spam.
 * Maps userId → last trigger timestamp.
 * Cooldown: 30 seconds between triggers per user.
 */
const rateLimitMap = new Map();
const RATE_LIMIT_COOLDOWN_MS = 30 * 1000; // 30 seconds

/**
 * Check if a user is rate-limited for SOS triggers.
 * @param {string} userId
 * @returns {{ allowed: boolean, retryAfterMs: number }}
 */
function checkRateLimit(userId) {
  const lastTriggered = rateLimitMap.get(userId);
  if (!lastTriggered) {
    return { allowed: true, retryAfterMs: 0 };
  }

  const elapsed = Date.now() - lastTriggered;
  if (elapsed < RATE_LIMIT_COOLDOWN_MS) {
    return {
      allowed: false,
      retryAfterMs: RATE_LIMIT_COOLDOWN_MS - elapsed,
    };
  }

  return { allowed: true, retryAfterMs: 0 };
}

/**
 * Record SOS trigger timestamp for rate limiting.
 * @param {string} userId
 */
function recordTrigger(userId) {
  rateLimitMap.set(userId, Date.now());
}

/**
 * Fetch user's trusted contacts and build SOS data.
 * No longer sends SMS — the frontend handles WhatsApp directly.
 *
 * @param {object} params
 * @param {string} params.userId - The authenticated user's ID
 * @param {number} params.latitude - User's current latitude
 * @param {number} params.longitude - User's current longitude
 * @returns {Promise<{ success: boolean, message: string, contacts: Array, userName: string, contactCount: number }>}
 */
export async function sendSOS({ userId, latitude, longitude }) {
  // 1. Rate limit check
  const rateCheck = checkRateLimit(userId);
  if (!rateCheck.allowed) {
    const retrySeconds = Math.ceil(rateCheck.retryAfterMs / 1000);
    return {
      success: false,
      message: `SOS rate limited. Please wait ${retrySeconds} seconds before sending again.`,
      rateLimited: true,
      retryAfterMs: rateCheck.retryAfterMs,
      contacts: [],
      contactCount: 0,
    };
  }

  // 2. Connect to DB and fetch trusted contacts
  await connectDB();

  const contacts = await TrustedContact.find({ userId }).lean();

  if (!contacts || contacts.length === 0) {
    return {
      success: false,
      message: 'No trusted contacts found. Please add emergency contacts first.',
      contacts: [],
      contactCount: 0,
    };
  }

  // 3. Get the user's name for the message
  const user = await User.findById(userId).select('name').lean();
  const userName = user?.name || 'A Kavach user';

  // 4. Record trigger for rate limiting
  recordTrigger(userId);

  // 5. Return contacts data — frontend will handle WhatsApp
  const contactList = contacts.map((c) => ({
    name: c.name,
    phone: c.phone,
  }));

  console.log(
    `[sendSOS] SOS prepared for user ${userId} — ${contactList.length} contacts ready for WhatsApp`
  );

  return {
    success: true,
    message: `SOS ready! ${contactList.length} contact(s) will be notified via WhatsApp.`,
    contacts: contactList,
    userName,
    contactCount: contactList.length,
  };
}

export default sendSOS;
