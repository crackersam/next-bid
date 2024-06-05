"use client";
import React from "react";
import { BidAction } from "./BidAction";
import { useRouter } from "next/navigation";

const Form = ({ user, item }) => {
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = await BidAction(formData);
    if (data.isError) {
      alert(data.message);
    } else {
      alert(data.message);
      form.reset();
      router.push(`/item/${item}`);
    }
  };
  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h1 className="text-2xl font-semibold">
          Place a bid
        </h1>
        <div className="mt-4">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            className="w-full p-2 border rounded-lg"
            required
          />

          <input type="hidden" name="item" value={item} />

          <input type="hidden" name="bidder" value={user} />

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white p-2 rounded-lg w-full"
          >
            Place bid
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
