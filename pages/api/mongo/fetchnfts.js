import { MongoClient } from "mongodb";
import { ipfsUri, MONGO, num } from "../../../utils/utils";
export default async function handler(req, res) {
  const client = new MongoClient(MONGO);
  try {
    const { type, inc } = req.query;
    await client.connect();
    const data = await fetch(client, type, num(inc));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching");
  } finally {
    await client.close();
  }
}
async function fetch(client, type = "fixedSale", inc = 0) {
  let db = client.db("collections");
  let dbs = await db.listCollections().toArray();
  const cols = dbs.filter(
    (obj) => obj.name !== "marketplace" && obj.name !== "profile"
  );
  const collections = cols.map((col) => col.name);
  const projection = {
    name: 1,
    image: 1,
    _id: 1,
    state: 1,
    seller: 1,
    salePrice: 1,
  };
  const options = { projection, sort: { timestamp: -1 } };
  const query = { state: type };
  let explore = [];
  for (let i = 0; i < collections.length; i++) {
    let collection = collections[i];
    const collectionQ = db.collection(collection);
    const objects = await collectionQ
      .find(query, options)
      .skip(inc)
      .limit(10)
      .toArray();
    objects.forEach((object) => {
      object.collection = collection;
      object.image = ipfsUri(object.image);
      object.tokenId = object._id;
      delete object._id;
    });
    explore.push(...objects);
  }

  return explore;
}
// fetch all listings: use in recentListings to fetch first 10/20 nfts
// use in fetchRecentAuctions if type is set to auctionSale
// use for explore, default fetches fixedSale, set type to auctionSale to fetch for auctions
