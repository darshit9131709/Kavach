import mongoose from 'mongoose';

const SOSSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for efficient queries
SOSSchema.index({ userId: 1, status: 1, createdAt: -1 });
SOSSchema.index({ status: 1, createdAt: -1 });

// Prevent re-compilation during development
const SOS = mongoose.models.SOS || mongoose.model('SOS', SOSSchema);

export default SOS;
