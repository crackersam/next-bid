import React from "react";
import Item from "@/models/Item";
import Link from "next/link";
import { connect } from "@/helpers/DBConfig";
import dayjs from "dayjs";
import User from "@/models/User";
import duration from "dayjs/plugin/duration";
import CountdownTimer from "./CountdownTimer";
dayjs.extend(duration);
connect();

const Page = async ({ params }) => {
  const { slug } = params;
  const item = await Item.findOne({ _id: slug });
  await item.populate("owner");
  await item.populate("bids.bidder");

  const isBiddingActive =
    dayjs(item.createdAt).add(24, "hour") > dayjs();
  const highestBid = item.bids.reduce((prev, current) => {
    return prev.bid > current.bid ? prev : current;
  }, {});

  return (
    <div>
      <h1 className="text-2xl">{item?.name}</h1>
      <p className="text-xl mb-3">{item?.description}</p>
      <img
        width={500}
        height={500}
        src={`data:image/jpeg;base64,${item?.image?.toString(
          "base64"
        )}`}
      />
      <p>Starting bid: £{item?.startingPrice}</p>
      <p>Owner: {item.owner.email}</p>
      <p>
        Ends: <CountdownTimer createdAt={item.createdAt} />
      </p>
      {isBiddingActive ? (
        <Link
          href={`/item/${slug}/bid`}
          className="text-blue-800 underline"
        >
          Place a bid
        </Link>
      ) : (
        "Bidding has ended"
      )}
      <h2 className="text-xl">Bids:</h2>
      {isBiddingActive ? (
        <ul>
          {item.bids.map((bid) => (
            <li key={bid._id}>
              {bid.bidder.email} - £{bid.bid}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          {highestBid.bid ? (
            <p>
              Highest bid: £{highestBid.bid} by{" "}
              {highestBid.bidder.email}
            </p>
          ) : (
            <p>No bids were placed</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
