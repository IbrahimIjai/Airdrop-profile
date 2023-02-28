import { MongoClient } from "mongodb";
import { MONGO } from "../../../../utils/utils";

export default async function handler(req, res) {
  const { collection } = req.query;
  const client = new MongoClient(MONGO);
  try {
    await client.connect();
    const data = await fetchCollection(client, collection);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching");
  } finally {
    await client.close();
  }
}

async function fetchCollection(client, id) {
  const db = client.db("collections").collection("marketplace");
  const doc = await db.findOne({ _id: id });
  return doc;
}
// fetch a specific collection data, we pass data[0] because it gets converted to an array
