import { createClient } from "redis";
import { REDIS, OffersInstance, low } from "../../../../../../utils/utils";
import { utils } from "ethers";

async function blockCall(collection, account, nft) {
  const contract = OffersInstance;
  let offer = await contract.getUserOffer(account, collection, nft);
  let obj = {
    offerCreator: low(offer[0]),
    offerValue: utils.formatEther(offer[1]),
    validity: offer[2],
    collection,
    nft,
    owner: low(offer[5]),
  };
  return obj;
}

export default async function handler(req, res) {
  const { collection, account, nft } = req.query;
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall(collection, account, nft);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const dataNfts = await redis.get(`${collection}/${account}/${nft}/userOffer`);
  if (dataNfts) {
    res.status(200).json(JSON.parse(dataNfts));
  } else {
    const returnData = await blockCall(collection, account, nft);
    await redis.setEx(
      `${collection}/${account}/${nft}/userOffer`,
      360,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
