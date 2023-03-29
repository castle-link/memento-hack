import mongoose, { Model } from "mongoose";
import { TokenDoc } from "./token.types";

const TokenSchema = new mongoose.Schema<TokenDoc>({
  refreshToken: { type: String, unique: true },
  expiresAt: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const Token = (mongoose.models.Token ||
  mongoose.model("Token", TokenSchema)) as Model<TokenDoc>;

export default Token;
