import React from "react";
import { connect } from "@/helpers/DBConfig";
import { GetDataFromToken } from "@/helpers/GetDataFromToken";
import Item from "@/models/Item";
import Link from "next/link";
connect();

const page = async () => {
  const user = GetDataFromToken();
  const items = await Item.find({
    "bids.bidder": user.id,
  });

  return (
    <div>
      <h1 className="text-2xl">My Bids</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <Link
              href={`/item/${item._id}`}
              className="text-blue-800 underline"
            >
              {item.name}
            </Link>
            {item.bids
              .filter((bid) => bid.bidder == user.id)
              .map((bid) => (
                <div key={bid._id}>
                  <p>Your bid: {bid.bid}</p>
                </div>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default page;
