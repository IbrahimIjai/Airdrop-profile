import { MongoClient } from "mongodb";
import { ipfsUri, low, MONGO } from "../../../../utils/utils";

export default async function handler(req, res) {
  const { collection, inc } = req.query;
  const ids = req.body;
  const client = new MongoClient(MONGO);
  try {
    await client.connect();
    let array = await fetchTokens(client, low(collection), ids, inc);
    let data = array.map((arr) => {
      const img = ipfsUri(arr.image);
      let newArr = { ...arr, image: img, tokenId: arr._id };
      delete newArr._id;
      return newArr;
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching");
  } finally {
    await client.close();
  }
}

async function fetchTokens(client, c, ids, inc = 0) {
  const database = client.db("collections");
  const collections = database.collection(c);
  const projection = {
    name: 1,
    image: 1,
    _id: 1,
    validity: 1,
    salePrice: 1,
    seller: 1,
    startingBid: 1,
    highestBid: 1,
    timestamp: 1,
  };
  const options = { projection, sort: { _id: 1 } };
  const data = await collections
    .find({ _id: { $in: ids } }, options)
    .skip(inc)
    .limit(20)
    .toArray();
  return data;
}
