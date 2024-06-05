"use client";
import React from "react";
import { LoginAction } from "./LoginAction";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await LoginAction(formData);
    if (result?.isError) {
      alert(result.message);
    } else {
      router.push("/");
    }
  };
  return (
    <>
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-semibold">Login</h1>
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
            required
          />
        </div>
        <div className="mt-4">
          <button className="w-full bg-blue-500 text-white p-2 rounded-lg">
            Login
          </button>
        </div>
      </form>
      <div className="mt-4">
        Not registered yet?{" "}
        <Link href="/register" className="text-blue-600">
          Register
        </Link>
      </div>
    </>
  );
};

export default Page;
