import { createClient } from "redis";
import {
  MarketplaceInstance,
  POST,
  REDIS,
  server,
} from "../../../../../utils/utils";

async function blockCall(collection) {
  const contract = MarketplaceInstance;
  const listings = await contract.getAllListings(collection);
  let data;
  if (listings) {
    let tokens = listings.map((listing) => listing[3].toNumber());
    let url = `${server}/api/mongo/${collection}/tokens`;
    data = await POST(url, tokens);
  }
  return data;
}
export default async function handler(req, res) {
  const { collection } = req.query;
  const redis = createClient({ url: REDIS });

  redis.on("error", async (err) => {
    const returnData = await blockCall(collection);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const listedNftsData = await redis.get(`${collection}/listed`);
  if (listedNftsData) {
    res.status(200).json(JSON.parse(listedNftsData));
  } else {
    const returnData = await blockCall(collection);
    await redis.setEx(`${collection}/listed`, 600, JSON.stringify(returnData));
    res.status(200).json(returnData);
  }
  await redis.quit();
}

// for (let i = 0; i < listings.length; i++) {
//   const objectData = {
//     address: listings[i][0],
//     salePrice: utils.formatEther(listings[i][1]),
//     nftId: listings[i][3].toNumber(),
//   };
//   data.push(objectData);
// }
