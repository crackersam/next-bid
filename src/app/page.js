import React from "react";
import Item from "@/models/Item";
import Link from "next/link";
import { connect } from "@/helpers/DBConfig";
import dayjs from "dayjs";
connect();

const page = async () => {
  const items = await Item.find()
    .limit(20)
    .sort({ createdAt: -1 });

  return (
    <div className="flex flex-row flex-wrap">
      {Object.entries(items).map(([key, value]) => (
        <Link key={key} href={`/item/${value._id}`}>
          <div
            key={key}
            className="bg-white p-4 shadow-lg rounded-lg my-4 mx-4"
          >
            <h1 className="text-2xl font-semibold">
              {value.name}
            </h1>
            <p>{value.description}</p>
            <p>Starting bid: {value.startingPrice}</p>
            <p>
              Bidding is{" "}
              {dayjs(value.createdAt).add(24, "hour") >
              dayjs()
                ? "open"
                : "closed"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default page;
