import { MongoClient } from "mongodb";
import { MONGO } from "../../../utils/utils";

export default async function handler(req, res) {
  const client = new MongoClient(MONGO);
  try {
    await client.connect();
    const data = await fetchCollection(client);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching");
  } finally {
    await client.close();
  }
}

async function fetchCollection(client) {
  const db = client.db("collections").collection("marketplace");
  const doc = await db.find({}).toArray();
  return doc;
}
// similar to my ipfs data api hosted on pinata
