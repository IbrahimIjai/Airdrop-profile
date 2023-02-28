import { MongoClient } from "mongodb";
import { MONGO } from "../../../../../utils/utils";

export default async function handler(req, res) {
  if (req.method !== "GET") res.status(500).json("Only Put requests");
  else {
    const { collection, nft } = req.query;
    let c = collection.toLowerCase();
    const client = new MongoClient(MONGO);
    try {
      await client.connect();
      await like(client, c, Number(nft));
      res.json("Success");
    } catch (err) {
      console.error(err);
      res.status(500).json("Error fetching");
    } finally {
      await client.close();
    }
  }
}

async function like(client, collection, nft) {
  const collections = client.db("collections").collection(collection);
  const find = await collections.findOne({ _id: nft });
}
// used to set like
