import { jwtVerify, SignJWT } from "jose";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Get encoded secret key
export async function getJwtSecretKey() {
  return new TextEncoder().encode(JWT_SECRET);
}

// Verify JWT from Authorization header
export async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  console.log(authHeader, "AUTH HEADER");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'

  if (!token) throw new Error("Token not found");

  try {
    const verified = await jwtVerify(token, await getJwtSecretKey());
    return verified.payload; // Return decoded payload
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// Generate JWT and return in Authorization header
export async function setAuthHeader(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d") // Token expires in 1 day
    .sign(await getJwtSecretKey());

  return `Bearer ${token}`; // Return Authorization header string
}
