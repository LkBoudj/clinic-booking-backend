import { Document, model, Schema, Types } from "mongoose";
export interface IRole {
  name: string;
  users?: Types.ObjectId[];
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
      ref: "user",
    },
  ],
});

const RoleModel = model<IRoleDoc>("Role", roleSchema);
export default RoleModel;
