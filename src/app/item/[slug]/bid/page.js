import React from "react";
import Item from "@/models/Item";
import Form from "./Form";
import { GetDataFromToken } from "@/helpers/GetDataFromToken";
import { connect } from "@/helpers/DBConfig";
connect();

const page = async ({ params }) => {
  const { slug } = params;

  const item = await Item.findOne({ _id: slug });
  console.log(item._id);
  const user = GetDataFromToken();
  return (
    <div>
      <h1>{item?.name}</h1>
      <p>{item?.description}</p>
      <p>Starting bid: {item?.startingPrice}</p>
      <Form user={user.id} item={item._id.toString()} />
    </div>
  );
};

export default page;
