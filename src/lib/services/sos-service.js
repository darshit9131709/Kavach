import connectDB from '@/lib/mongodb';
import SOS from '@/models/SOS';

export async function createSosEvent({ userId, latitude, longitude }) {
  await connectDB();
  return SOS.create({
    userId,
    latitude,
    longitude,
    status: 'active',
  });
}

export async function listSosEventsForUser({ userId, status }) {
  await connectDB();
  const query = { userId };
  if (status && (status === 'active' || status === 'resolved')) {
    query.status = status;
  }

  return SOS.find(query)
    .sort({ createdAt: -1 })
    .limit(50)
    .select('-userId')
    .lean();
}

