"use client";
import React from "react";
import { ListitemAction } from "./ListitemAction";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = await ListitemAction(formData);
    if (data.isError) {
      alert(data.message);
    } else {
      alert(data.message);
      form.reset();
      router.push("/");
    }
  };

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h1 className="text-2xl font-semibold">Add Item</h1>
        <div className="mt-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="price">Starting bid</label>
          <input
            type="number"
            id="price"
            name="startingPrice"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
