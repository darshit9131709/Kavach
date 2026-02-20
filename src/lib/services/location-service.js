import connectDB from '@/lib/mongodb';
import Location from '@/models/Location';

export async function createLocationEntry({ userId, latitude, longitude, timestamp }) {
  await connectDB();
  return Location.create({
    userId,
    latitude,
    longitude,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
  });
}

export async function getLatestLocation({ userId }) {
  await connectDB();
  return Location.findOne({ userId }).sort({ timestamp: -1 }).select('-userId').lean();
}

