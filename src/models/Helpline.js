import mongoose from 'mongoose';

const HelplineSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'Police',
        'Women Helpline',
        'Child Helpline',
        'Medical Emergency',
        'Fire',
        'Disaster Management',
        'Other',
      ],
      index: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please provide a valid phone number'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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
HelplineSchema.index({ state: 1, category: 1, isActive: 1 });
HelplineSchema.index({ state: 1, isActive: 1 });

// Prevent re-compilation during development
const Helpline = mongoose.models.Helpline || mongoose.model('Helpline', HelplineSchema);

export default Helpline;
