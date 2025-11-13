import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  fullName: { type: String, trim: true },
  slug: { type: String, unique: true, sparse: true },
  position: { type: String, trim: true },
  department: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  bio: { type: String },
  photo: { url: String, public_id: String },
  qrCodeUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ✅ keep fullName consistent on save
StaffSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
