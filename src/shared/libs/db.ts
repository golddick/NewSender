import mongoose from "mongoose";
import { driver, createAstraUri } from "stargate-mongoose";

export const connectDb = async () => {
  try {
    const uri = createAstraUri(
      process.env.ASTRA_DB_API_ENDPOINT!,
      process.env.ASTRA_DB_APPLICATION_TOKEN!
    );

    // Check if there's an existing connection
    if (mongoose.connection.readyState !== 0) {
      // Disconnect the existing connection
      await mongoose.disconnect();
    }
    mongoose.set("autoCreate", true);
    mongoose.setDriver(driver);

    await mongoose
      .connect(uri, {
        isAstra: true,
      })
      .then((res) => {
        console.log("connected");
      })
      .catch((r) => {
        console.log(r);
      });
  } catch (error) {
    console.log(error);
  }
};










// import mongoose from "mongoose";
// import { driver, createAstraUri } from "stargate-mongoose";

// // Track if driver is set
// let driverInitialized = false;

// export const connectDb = async () => {
//   try {
//     // Return early if already connected
//     if (mongoose.connection.readyState === 1) {
//       console.log("✅ Already connected to the database.");
//       return;
//     }

//     const uri = createAstraUri(
//       process.env.ASTRA_DB_API_ENDPOINT!,
//       process.env.ASTRA_DB_APPLICATION_TOKEN!
//     );

//     if (!driverInitialized) {
//       mongoose.setDriver(driver);
//       driverInitialized = true;
//       mongoose.set("autoCreate", true);
//     }

//     // Only connect if not already connected
//     await mongoose.connect(uri, { isAstra: true });
//     console.log("✅ Connected to Astra DB successfully!");
//   } catch (error) {
//     console.error("❌ Error connecting to the database:", error);
//   }
// };
