import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  favorites: string[];
  see_later: string[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: String, default: [] }],
  see_later: [{ type: String, default: [] }],
});

export default mongoose.model<IUser>("User", UserSchema);