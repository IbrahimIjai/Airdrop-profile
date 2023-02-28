import { createClient } from "redis";
import { OffersInstance, REDIS } from "../../../../../utils/utils";

async function blockCall(collection, account) {
  const contract = OffersInstance;
  let tokensArray = await contract.getUserOffers(account, collection);
  let tokens = tokensArray.map((token) => token.toNumber());
  return tokens;
}

export default async function handler(req, res) {
  const { collection, account } = req.query;
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall(collection, account);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const dataNfts = await redis.get(`${collection}/${account}/userOffers`);
  if (dataNfts) {
    res.status(200).json(JSON.parse(dataNfts));
  } else {
    const returnData = await blockCall(collection, account);
    await redis.setEx(
      `${collection}/${account}/userOffers`,
      360,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
