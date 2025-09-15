// import { currentUser } from "@clerk/nextjs/server";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

// if (!JWT_SECRET) {
//   throw new Error("Missing JWT_SECRET_KEY in environment");
// }

// type TokenPayload = {
//   id: string;
//   email: string;
//   iat: number;
//   regenerated?: boolean;
// };

// export const generateApiKey = async (): Promise<string> => {
//   const user = await currentUser();
//   if (!user) throw new Error("User not authenticated");

//   const payload: TokenPayload = {
//     id: user.id,
//     email: user.emailAddresses[0]?.emailAddress || "unknown",
//     iat: Date.now(),
//   };

//   return jwt.sign(payload, JWT_SECRET, { expiresIn: "365d" });
// };

// export const regenerateApiKey = async (): Promise<string> => {
//   const user = await currentUser();
//   if (!user) throw new Error("User not authenticated");

//   const payload: TokenPayload = {
//     id: user.id,
//     email: user.emailAddresses[0]?.emailAddress || "unknown",
//     iat: Date.now(),
//     regenerated: true,
//   };

//   return jwt.sign(payload, JWT_SECRET, { expiresIn: "365d" });
// };


 



