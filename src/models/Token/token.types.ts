import { HydratedDocument } from "mongoose";
import type { UserDoc } from "../User/user.types";

interface IToken {
  refreshToken: string;
  expiresAt: Date;
  userId: UserDoc["_id"];
}

export type TokenDoc = HydratedDocument<IToken>;
