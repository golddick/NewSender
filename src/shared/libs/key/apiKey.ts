// import { currentUser } from "@clerk/nextjs/server";
// import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
// import crypto from "crypto";
// import { db } from "@/shared/libs/database";

// const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

// if (!JWT_SECRET) {
//   throw new Error("Missing JWT_SECRET_KEY in environment");
// }

// // --------------------
// // Utility functions
// // --------------------

// // Generate client-facing API key (xapi- prefix + random 12 chars)
// function generateApiKey(): string {
//   const prefix = "xapi-";
//   const random = crypto.randomBytes(9).toString("base64url"); // 12 chars
//   return prefix + random;
// }

// // Hash API key before storing
// function hashKey(key: string): string {
//   return crypto.createHash("sha256").update(key).digest("hex");
// }

// // Generate JWT for internal use (claims + expiry)
// function generateJwt(payload: object, expiresIn: string | number = "365d"): string {
//   // Convert numeric values to string format that jwt accepts
//   if (typeof expiresIn === 'number') {
//     expiresIn = `${expiresIn}s`; // Convert seconds to string format
//   }
  
//   return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
// }


// // --------------------
// // API key functions
// // --------------------

// // Create new API key
// export const createApiKey = async () => {
//   const user = await currentUser();
//   if (!user) throw new Error("User not authenticated");

//   const apiKey = generateApiKey(); // raw client key
//   const keyHash = hashKey(apiKey);

//   // JWT with claims
//   const payload = {
//     id: user.id,
//     email: user.emailAddresses[0]?.emailAddress || "unknown",
//     type: "api-key",
//   };
//   const jwtToken = generateJwt(payload, "365d");

//   const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

//   await db.apiKey.create({
//     data: {
//       userId: user.id,
//       keyHash,
//       jwt: jwtToken,
//       expiresAt,
//     },
//   });

//   return { apiKey, expiresAt };
// };

// // Regenerate API key (replaces old one)
// export const regenerateApiKey = async () => {
//   const user = await currentUser();
//   if (!user) throw new Error("User not authenticated");

//   const apiKey = generateApiKey();
//   const keyHash = hashKey(apiKey);

//   const payload = {
//     id: user.id,
//     email: user.emailAddresses[0]?.emailAddress || "unknown",
//     type: "api-key",
//     regenerated: true,
//   };
//   const jwtToken = generateJwt(payload, "365d");

//   const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

//   // Optional: remove old keys
//   await db.apiKey.deleteMany({ where: { userId: user.id } });

//   await db.apiKey.create({
//     data: {
//       userId: user.id,
//       keyHash,
//       jwt: jwtToken,
//       expiresAt,
//     },
//   });

//   return { apiKey, expiresAt };
// };

// // Verify API key
// export const verifyApiKey = async (rawKey: string) => {
//   const keyHash = hashKey(rawKey);

//   const record = await db.apiKey.findUnique({ where: { keyHash } });
//   if (!record) return { error: "Invalid API key" };

//   try {
//     const decoded = jwt.verify(record.jwt, JWT_SECRET) as JwtPayload;

//     if (record.expiresAt < new Date()) {
//       return { error: "API key expired" };
//     }

//     return { userId: record.userId, claims: decoded };
//   } catch (err) {
//     return { error: "Invalid or expired token" };
//   }
// };


import crypto from "crypto";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { db } from "@/shared/libs/database";
import { currentUser } from "@clerk/nextjs/server";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
const ENC_SECRET = process.env.ENC_SECRET as string; // must be 32 chars for AES-256

if (!JWT_SECRET || !ENC_SECRET) {
  throw new Error("Missing JWT_SECRET_KEY or ENC_SECRET in environment");
}

// --------------------
// Helpers
// --------------------

function generateApiKey(): string {
  const prefix = "xapi-";
  const random = crypto.randomBytes(9).toString("base64url"); // ~12 chars
  return prefix + random;
}

function encryptKey(key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENC_SECRET), iv);
  let encrypted = cipher.update(key, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decryptKey(encryptedKey: string): string {
  const [ivHex, encrypted] = encryptedKey.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENC_SECRET), iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function generateJwt(payload: object, expiresIn: string | number = "365d"): string {
  if (typeof expiresIn === "number") {
    expiresIn = `${expiresIn}s`;
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
}

// --------------------
// API key functions
// --------------------

// Create new API key
export const createApiKey = async () => {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");

  const apiKey = generateApiKey(); // raw client key
  const encryptedKey = encryptKey(apiKey);

  const payload = {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || "unknown",
    type: "api-key",
  };
  const jwtToken = generateJwt(payload, "365d");

  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  await db.apiKey.create({
    data: {
      userId: user.id,
      keyHash: encryptedKey, // store encrypted key
      jwt: jwtToken,
      expiresAt,
    },
  });

  return { apiKey, expiresAt };
};

// Retrieve existing API key (decrypt)
export const getApiKey = async () => {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");

  const record = await db.apiKey.findFirst({ where: { userId: user.id } });
  if (!record) return null;

  const rawKey = decryptKey(record.keyHash);
  return { apiKey: rawKey, expiresAt: record.expiresAt };
};

// Regenerate API key (delete old one and return new)
export const regenerateApiKey = async () => {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");

  // 🔄 Delete old keys
  await db.apiKey.deleteMany({ where: { userId: user.id } });

  // ➕ Create new key
  const apiKey = generateApiKey();
  const encryptedKey = encryptKey(apiKey);

  const payload = {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || "unknown",
    type: "api-key",
    regenerated: true,
  };
  const jwtToken = generateJwt(payload, "365d");

  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  await db.apiKey.create({
    data: {
      userId: user.id,
      keyHash: encryptedKey,
      jwt: jwtToken,
      expiresAt,
    },
  });

  return { apiKey, expiresAt };
};
