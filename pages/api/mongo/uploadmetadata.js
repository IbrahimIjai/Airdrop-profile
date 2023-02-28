import { MongoClient } from "mongodb";
import { DCL, DCL_Instance, MONGO } from "../../../utils/utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(500).json({ message: "Only Post requests are supported" });
  } else {
    const id = await DCL_Instance.totalSupply();
    let object = restructureData(req.body, id);
    const client = new MongoClient(MONGO);
    try {
      await client.connect();
      await addMetadata(client, object);
    } catch (err) {
      console.error(err);
      res.status(500).json(false);
    } finally {
      await client.close();
    }
    res.status(200).json(id);
  }
}

async function addMetadata(client, data) {
  await client.db("collections").collection(DCL).insertOne(data);
}

function restructureData(object, id) {
  let { name, description, attributes } = object;
  name = capFirstWord(name);
  description = capitalize(description);
  attributes = attributes.map((attribute) => {
    return {
      trait_type: capFirstWord(attribute.attributeName),
      value: capFirstWord(attribute.attribute),
    };
  });
  return {
    ...object,
    name,
    description,
    attributes,
    _id: id.toNumber(),
    tokenId: id.toNumber(),
    salePrice: null,
    seller: deadAddress,
    timestamp: null,
    offers: [],
    bids: [],
    validity: null,
    state: "none",
    startingBid: null,
    highestBidder: null,
    highestBid: null,
  };
}

const capFirstWord = (string) => {
  return string
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

const capitalize = (str) => {
  let capitalized = str[0].toUpperCase();
  for (let i = 1; i < str.length; i++) {
    if (str[i - 2] === "." && str[i] !== " ") {
      capitalized += str[i].toUpperCase();
    } else {
      capitalized += str[i];
    }
  }
  return capitalized;
};
// used to upload tokenId data to mongoDB for Distant Collections
