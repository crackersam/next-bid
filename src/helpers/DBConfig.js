import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected");
    });
    connection.on("error", (error) => {
      console.log(error.message);
      process.exit(1);
    });
    return connection;
  } catch (error) {
    console.log(error.message);
  }
}
