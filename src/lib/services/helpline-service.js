import connectDB from '@/lib/mongodb';
import Helpline from '@/models/Helpline';

export async function listPublicHelplines({ state, category }) {
  await connectDB();
  const query = { isActive: true };
  if (state) query.state = state.toUpperCase();
  if (category) query.category = category;

  return Helpline.find(query)
    .sort({ state: 1, category: 1 })
    .select('-isActive -createdAt -updatedAt')
    .lean();
}

export async function createHelpline({
  state,
  category,
  phoneNumber,
  description,
  isActive = true,
}) {
  await connectDB();
  return Helpline.create({
    state: state.trim().toUpperCase(),
    category: category.trim(),
    phoneNumber: phoneNumber.trim(),
    description: description?.trim() || '',
    isActive: isActive !== undefined ? isActive : true,
  });
}

export async function listHelplines({ state, category, isActive }) {
  await connectDB();
  const query = {};
  if (state) query.state = state.toUpperCase();
  if (category) query.category = category;
  if (isActive !== null && isActive !== undefined) query.isActive = isActive;

  return Helpline.find(query).sort({ state: 1, category: 1, createdAt: -1 }).lean();
}

export async function updateHelplineById(id, updates) {
  await connectDB();
  const helpline = await Helpline.findById(id);
  if (!helpline) return null;

  const { state, category, phoneNumber, description, isActive } = updates;
  if (state !== undefined) helpline.state = state.trim().toUpperCase();
  if (category !== undefined) helpline.category = category.trim();
  if (phoneNumber !== undefined) helpline.phoneNumber = phoneNumber.trim();
  if (description !== undefined) helpline.description = description.trim();
  if (isActive !== undefined) helpline.isActive = isActive;

  await helpline.save();
  return helpline;
}

export async function deleteHelplineById(id) {
  await connectDB();
  const helpline = await Helpline.findById(id);
  if (!helpline) return null;
  await Helpline.deleteOne({ _id: id });
  return helpline;
}

