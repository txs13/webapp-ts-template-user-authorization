import mongoose from "mongoose";

export interface RoleInput {
  role: string;
  description?: string;
}

const RoleSchema = new mongoose.Schema<RoleDocument>(
  {
    role: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export interface RoleDocument extends RoleInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const RoleModel = mongoose.model<RoleDocument>("Role", RoleSchema);

export default RoleModel;
