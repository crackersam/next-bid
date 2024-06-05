"use server";
import Item from "@/models/Item";
import { connect } from "@/helpers/DBConfig";
import { GetDataFromToken } from "@/helpers/GetDataFromToken";
import { revalidatePath } from "next/cache";
connect();

export const ListitemAction = async (formData) => {
  const user = GetDataFromToken();
  if (!formData.get("name")) {
    return { isError: true, message: "Name is required" };
  }
  if (!formData.get("description")) {
    return {
      isError: true,
      message: "Description is required",
    };
  }
  if (!formData.get("startingPrice")) {
    return {
      isError: true,
      message: "Starting price is required",
    };
  }
  if (!formData.get("image")) {
    return { isError: true, message: "Image is required" };
  }
  try {
    const image = formData.get("image");
    if (!image.type.startsWith("image/")) {
      return {
        isError: true,
        message: "File must be an image",
      };
    }
    if (image.size > 5000000) {
      return {
        isError: true,
        message: "File size must be less than 5MB",
      };
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(image.size, buffer.length);
    await Item.create({
      name: formData.get("name"),
      description: formData.get("description"),
      startingPrice: formData.get("startingPrice"),
      owner: user.id,
      image: buffer,
    });
    revalidatePath("/");
    return {
      isError: false,
      message: "Item created successfully",
    };
  } catch (error) {
    return { isError: true, message: error.message };
  }
};
