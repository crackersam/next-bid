"use server";
import { connect } from "@/helpers/DBConfig";
import Item from "@/models/Item";
import { GetDataFromToken } from "@/helpers/GetDataFromToken";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";
connect();

export const BidAction = async (formData) => {
  const user = GetDataFromToken();
  if (!formData.get("price")) {
    return {
      isError: true,
      message: "Price is required",
    };
  }
  try {
    const item = await Item.findOne({
      _id: formData.get("item"),
    });
    if (
      dayjs(item.createdAt).add(24, "hour") < new Date()
    ) {
      return {
        isError: true,
        message: "Bidding has ended",
      };
    }
    if (item.owner == user.id) {
      return {
        isError: true,
        message: "You cannot bid on your own item",
      };
    }
    if (formData.get("price") < item.startingPrice) {
      return {
        isError: true,
        message:
          "Bid should be greater than starting price",
      };
    }

    const bid = {
      bid: formData.get("price"),
      bidder: user.id,
    };
    item.bids.push(bid);
    await item.save();
    revalidatePath(`/item/${formData.get("item")}`);
    return {
      isError: false,
      message: "Bid created successfully",
    };
  } catch (error) {
    return { isError: true, message: error.message };
  }
};
