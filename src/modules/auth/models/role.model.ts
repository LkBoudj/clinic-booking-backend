import { Document, model, Schema, Types } from "mongoose";
export interface IRole {
  name: string;
  users?: Types.ObjectId[];
  permissions?: Types.ObjectId[];
}

export type IRoleDoc = IRole & Document;

const roleSchema = new Schema<IRoleDoc>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
});

const RoleModel = model<IRoleDoc>("Role", roleSchema);
export default RoleModel;
