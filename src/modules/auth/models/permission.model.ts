// models/permission.model.ts

import { Schema, model, Document, Types } from "mongoose";

export interface IPermission {
  action: string; // ex: 'read', 'create'
  subject: string; // ex: 'Post', 'User'
  conditions?: Record<string, any>; // optional conditions
  roles?: Types.ObjectId[];
  users?: Types.ObjectId[];
}
export interface IPermissionDoc extends IPermission, Document {}

const permissionSchema = new Schema<IPermissionDoc>({
  action: { type: String, required: true },
  subject: { type: String, required: true },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  conditions: { type: Schema.Types.Mixed }, // JSON شروط إضافية
});

permissionSchema.index({ action: 1, subject: 1 }, { unique: true });
const PermissionModel = model<IPermissionDoc>("Permission", permissionSchema);
export default PermissionModel;
