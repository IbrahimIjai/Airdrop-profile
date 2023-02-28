import { createClient } from "redis";
import { utils } from "ethers";
import { OffersInstance, REDIS } from "../../../../../utils/utils";

async function blockCall(collection) {
  let contract = OffersInstance;
  const data = await contract.getCollectionOffers(collection);
  const allCollectionOffers = [];
  let content = { allCollectionOffers, highestOffer: null };
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const object = {
        offerCreator: data[i][0],
        collection: data[i][1],
        value: utils.formatEther(data[i][2]),
        count: data[i][3].toNumber(),
      };
      allCollectionOffers.push(object);
    }
    const highestOffer = allCollectionOffers.reduce(
      (max, current) => (current.value > max.value ? current : max),
      { value: -Infinity }
    );
    content = { allCollectionOffers, highestOffer };
  }
  return content;
}

export default async function handler(req, res) {
  const { collection } = req.query;
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall(collection.toLowerCase());
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const collectionDetails = await redis.get(`${collection}/collectionOffers`);
  if (collectionDetails) {
    res.status(200).json(JSON.parse(collectionDetails));
    return;
  } else {
    const returnData = await blockCall(collection.toLowerCase());
    await redis.setEx(
      `${collection}/collectionOffers`,
      200,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
