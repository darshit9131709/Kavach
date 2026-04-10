import mongoose from 'mongoose';

const TrustedContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please provide a valid phone number'],
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    relation: {
      type: String,
      required: [true, 'Relation is required'],
      trim: true,
      maxlength: [50, 'Relation cannot exceed 50 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for efficient queries
TrustedContactSchema.index({ userId: 1, createdAt: -1 });
TrustedContactSchema.index({ userId: 1, phone: 1 }); // For duplicate checking

// Prevent re-compilation during development
const TrustedContact = mongoose.models.TrustedContact || mongoose.model('TrustedContact', TrustedContactSchema);

export default TrustedContact;
