import { MongoClient } from "mongodb";
import { DCL, MONGO } from "../../../utils/utils";

export default async function handler(req, res) {
  const { id } = req.query;
  const client = new MongoClient(MONGO);
  try {
    await client.connect();
    const resp = await search(client, { _id: Number(id) });
    res.status(200).json(resp);
  } catch (err) {
    console.error(err);
    res.status(500).json(false);
  } finally {
    await client.close();
  }
}
async function search(client, data) {
  let res = await client.db("collections").collection(DCL).findOne(data);
  return res;
}
