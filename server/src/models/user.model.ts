import mongoose from "mongoose";
import getEnvVars from "../config/config";
import bcrypt from "bcrypt";
import { IndexDefinition } from "mongoose";

const { saltWorkFactor } = getEnvVars();

export interface UserInput {
  email: string;
  password: string;
  name: string;
  familyname?: string;
  phone?: string;
  address?: string;
  company?: string;
  position?: string;
  description?: string;
  userrole_id: string;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    familyname: { type: String },
    phone: { type: String },
    address: { type: String },
    company: { type: String },
    position: { type: String },
    description: { type: String },
    userrole_id: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: String): Promise<Boolean>;
}

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(saltWorkFactor);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
