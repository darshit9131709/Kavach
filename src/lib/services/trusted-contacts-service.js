import connectDB from '@/lib/mongodb';
import TrustedContact from '@/models/TrustedContact';

export async function createTrustedContact({ userId, name, phone, email, relation }) {
  await connectDB();

  const existingContact = await TrustedContact.findOne({
    userId,
    phone: phone.trim(),
  });

  if (existingContact) {
    const err = new Error('DUPLICATE_PHONE');
    err.code = 11000; // mimic Mongo duplicate semantics used by handlers
    throw err;
  }

  return TrustedContact.create({
    userId,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : undefined,
    relation: relation.trim(),
  });
}

export async function listTrustedContacts({ userId }) {
  await connectDB();
  return TrustedContact.find({ userId })
    .sort({ createdAt: -1 })
    .select('-userId')
    .lean();
}

export async function deleteTrustedContact({ userId, contactId }) {
  await connectDB();

  const contact = await TrustedContact.findOne({
    _id: contactId,
    userId,
  });

  if (!contact) {
    return { deleted: false };
  }

  await TrustedContact.deleteOne({ _id: contactId });
  return { deleted: true };
}

