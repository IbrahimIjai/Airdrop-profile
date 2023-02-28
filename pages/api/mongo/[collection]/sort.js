import { MongoClient } from "mongodb";
import { MONGO, ipfsUri } from "../../../../utils/utils";

export default async function handler(req, res) {
  if (req.method !== "GET") res.status(500).json("Only Get requests");
  else {
    const { q, inc, collection } = req.query;
    const client = new MongoClient(MONGO);
    try {
      await client.connect();
      const array = await sort(
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

async function sort(client, searchInput, inc, collection) {
  const collections = client.db("collections").collection(collection);
  let data;
  const projection = { name: 1, image: 1, _id: 1 };
  const options = { projection, sort: { _id: 1 } };
  switch (searchInput) {
    case "Recently Listed":
      data = await collections
        .find({ timestamp: { $exists: true, $ne: null } })
        .sort({ timestamp: -1 })
        .project(projection)
        .skip(inc)
        .limit(20)
        .toArray();
      break;
    case "Price: High to Low":
      data = await collections
        .find({ salePrice: { $exists: true, $ne: null } })
        .sort({ salePrice: -1 })
        .project(projection)
        .skip(inc)
        .limit(20)
        .toArray();
      break;
    case "Price: Low to High":
      data = await collections
        .find({ salePrice: { $exists: true, $ne: null } })
        .sort({ salePrice: 1 })
        .project(projection)
        .skip(inc)
        .limit(20)
        .toArray();
      break;
    case "All Items":
      data = await collections.find({}, options).skip(inc).limit(20).toArray();
      break;
    default:
      break;
  }
  return data;
}
