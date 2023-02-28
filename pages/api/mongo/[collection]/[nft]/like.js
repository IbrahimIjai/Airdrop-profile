import { MongoClient } from "mongodb";
import { MONGO } from "../../../../../utils/utils";

export default async function handler(req, res) {
  if (req.method !== "PUT") res.status(500).json("Only Put requests");
  else {
    const { account, collection, nft } = req.query;
    let c = collection.toLowerCase();
    const client = new MongoClient(MONGO);
    try {
      await client.connect();
      await like(client, c, account, Number(nft));
      res.json("Success");
    } catch (err) {
      console.error(err);
      res.status(500).json("Error fetching");
    } finally {
      await client.close();
    }
  }
}

async function like(client, collection, account, nft) {
  const collections = client.db("collections").collection(collection);
  const profile = client.db("collections").collection("profile");
  const find = await collections.findOne({ _id: nft });
  if (find.likes !== undefined && find.likes.some((acc) => account === acc)) {
    // user has an active like. remove
    await profile.updateOne(
      { _id: account },
      { $pull: { likes: { collection: nft } } }
    );
    await collections.updateOne({ _id: nft }, { $pull: { likes: account } });
  } else {
    // user has no active like
    await collections.updateOne({ _id: nft }, { $push: { likes: account } });
    let update = {};
    update["$push"] = {};
    update["$push"]["likes." + collection] = nft;
    await profile.updateOne({ _id: account }, update, { upsert: true });
  }
}
// used to set like
