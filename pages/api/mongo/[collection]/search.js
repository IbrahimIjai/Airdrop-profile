import { MongoClient } from "mongodb";
import { ipfsUri, MONGO } from "../../../../utils/utils";

export default async function handler(req, res) {
  if (req.method !== "GET") res.status(500).json("Only Get requests");
  else {
    const { q, inc, collection } = req.query;
    const client = new MongoClient(MONGO);
    try {
      await client.connect();
      let array = await fetchSearchInput(
        client,
        q,
        parseInt(inc),
        collection.toLowerCase()
      );
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
}

async function fetchSearchInput(client, value, inc, c) {
  const database = client.db("collections");
  const collections = database.collection(c);
  const projection = { name: 1, image: 1, _id: 1 };
  const options = { projection, sort: { _id: 1 } };
  const data = await collections
    .find(
      {
        $or: [
          { _id: { $regex: new RegExp(".*" + value + ".*", "i") } },
          { name: { $regex: new RegExp(".*" + value + ".*", "i") } },
          {
            "attributes.value": {
              $regex: new RegExp(".*" + value + ".*", "i"),
            },
          },
        ],
      },
      options
    )
    .skip(inc)
    .limit(20)
    .toArray();
  return data;
}
