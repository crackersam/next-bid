"use client";
import React from "react";
import { RegisterAction } from "./RegisterAction";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await RegisterAction(formData);
    console.log(result);
    if (result.isError) {
      alert(result.message);
    } else {
      alert(result.message);
      form.reset();
      router.push("/login");
    }
  };
  return (
    <>
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-semibold">Register</h1>
        <div className="mt-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="mt-4">
          <button className="w-full bg-blue-500 text-white p-2 rounded-lg">
            Register
          </button>
        </div>
      </form>
      <div className="mt-4">
        Already registered?{" "}
        <Link href="/login" className="text-blue-600">
          Login
        </Link>
      </div>
    </>
  );
};

export default Page;
