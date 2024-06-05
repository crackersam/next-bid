import React from "react";
import { GetDataFromToken } from "@/helpers/GetDataFromToken";
import { connect } from "@/helpers/DBConfig.js";
import User from "@/models/User";
import Link from "next/link";
import { revalidatePath } from "next/cache";

connect();

const page = async () => {
  const user = GetDataFromToken();
  const userDoc = await User.findById(user.id);
  async function upload(data) {
    "use server";
    // Check if the user is logged in
    const user = GetDataFromToken();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const userDoc = await User.findById(user.id);

    const file = data.get("file"); // 'file' is the name attribute of the file input
    if (!file) {
      throw new Error("No file uploaded");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file to the database
    userDoc.avatar = buffer;
    await userDoc.save();
    console.log("File saved to database");
    revalidatePath("/profile");
    return { success: true };
  }
  return (
    <div>
      {user &&
        Object.entries(user).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {value}
          </p>
        ))}
      <Link
        href="/mybids"
        className="text-blue-800 underline"
      >
        My Bids
      </Link>
      <form action={upload}>
        <input type="file" name="file" />
        <input type="submit" value="Upload" />
      </form>
      {userDoc?.avatar && (
        <img
          width={500}
          height={500}
          src={`data:image/jpeg;base64,${userDoc.avatar.toString(
            "base64"
          )}`}
        />
      )}
    </div>
  );
};

export default page;
