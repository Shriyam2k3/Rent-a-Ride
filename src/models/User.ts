import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "@/types";

export interface IUserDocument {
  firebaseUid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
