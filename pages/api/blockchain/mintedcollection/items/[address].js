import { utils } from "ethers";
import { createClient } from "redis";
import {
  FETCH,
  ipfsUri,
  MarketplaceInstance,
  REDIS,
} from "../../../../../utils/utils";

async function blockCall(address, uri, supply) {
  let contract = MarketplaceInstance;
  const collection = await contract.getCollectionData(address);
  const items = [];
  for (let i = 1; i <= supply; i++) {
    let url = ipfsUri(uri);
    let salePrice = null;
    const data = await FETCH(url);
    const { name, image } = data;
    const imageUrl = ipfsUri(image);
    if (collection[0] !== deadAddress) {
      const results = await contract.getListing(address, i);
      salePrice = results[1] === 0 ? 0 : utils.formatEther(results[1]);
    }
    const obj = {
      name,
      image: imageUrl,
      salePrice,
    };
    items.push(obj);
  }
  return items;
}
export default async function handler(req, res) {
  const { address, uri, supply } = req.query;
  const redis = createClient({ url: REDIS });

  redis.on("error", async (err) => {
    const returnData = await blockCall(address, uri, supply);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const data = await redis.get(`mintedItems/${address}`);
  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    const returnData = await blockCall(address, uri, supply);
    await redis.setEx(
      `mintedItems/${address}`,
      360,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
