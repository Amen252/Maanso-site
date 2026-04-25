import { SignJWT } from "jose";
import { JWT_SECRET } from "./getJWTSecret.js";

export const generateToken = async (payload, expiresIn) => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
};
