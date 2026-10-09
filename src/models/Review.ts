import mongoose, { Schema, Document } from "mongoose";

export interface IReviewDocument {
  carId: mongoose.Types.ObjectId;
  userId: string;
  bookingId?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true, index: true },
    userId: { type: String, required: true },
    bookingId: { type: String },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Review || mongoose.model<IReviewDocument>("Review", ReviewSchema);
