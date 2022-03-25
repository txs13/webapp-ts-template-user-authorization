import mongoose, {Types} from "mongoose";

export interface AdminInput {
  userId: Types.ObjectId;
  description?: string;
}

const AdminSchema = new mongoose.Schema<AdminDocument>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export interface AdminDocument extends AdminInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const AdminModel = mongoose.model<AdminDocument>("Admin", AdminSchema);

export default AdminModel;
