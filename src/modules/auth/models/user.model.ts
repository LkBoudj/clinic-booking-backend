import { Document, Model, model, Schema, Types } from "mongoose";
import { comparePassword, hashPassword } from "../../../utils/security.utils";

export enum EGender {
  M = "male",
  F = "female",
}

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: EGender;
  role: Types.ObjectId;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type IUserDoc = IUser & Document;

export interface IUserModel extends Model<IUserDoc> {
  findByEmail(email: string): Promise<IUserDoc | null>;
}

const userSchema = new Schema<IUserDoc>(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(EGender),
      default: EGender.M,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Static Method
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

// ✅ Instance Method
userSchema.methods.checkPassword = async function (
  candidate: string
): Promise<boolean> {
  if (!this.password) {
    throw new Error("Password not selected in query");
  }
  return await comparePassword(candidate, this.password);
};

// ✅ Pre Save Hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

const UserModel = model<IUserDoc, IUserModel>("User", userSchema);

export default UserModel;
