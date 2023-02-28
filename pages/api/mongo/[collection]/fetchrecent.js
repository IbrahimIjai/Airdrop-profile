import { MongoClient } from "mongodb";
import { MONGO } from "../../../../utils/utils";
export default async function handler(req, res) {
  const client = new MongoClient(MONGO);
  try {
    const { collection } = req.query;
    await client.connect();
    const data = await fetch(client, collection);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching");
  } finally {
    await client.close();
  }
}
async function fetch(client, id) {
  let db = client.db("collections");
  const collectionQ = db.collection(id);
  const projection = {
    name: 1,
    image: 1,
    _id: 1,
    state: 1,
    seller: 1,
    salePrice: 1,
    startingBid: 1,
    highestBid: 1,
    validity: 1,
  };
  const options = { projection, sort: { timestamp: -1 }, limit: 10 };
  const query = { state: { $ne: null } };
  let explore = [];
  const objects = await collectionQ.find(query, options).toArray();
  objects.forEach((object) => {
    object.collection = id;
  });
  explore.push(...objects);

  return explore;
}
// fetch all recent listings for a collection: trim the nftId in the page component
