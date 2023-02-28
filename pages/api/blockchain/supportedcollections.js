import { createClient } from "redis";
import { MarketplaceInstance, REDIS } from "../../../utils/utils";

async function blockCall() {
  const addresses = await MarketplaceInstance.getSupportedCollections();
  return addresses;
}

export default async function handler(req, res) {
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall();
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const data = await redis.get("supportedCollections");
  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    const returnData = await blockCall();
    await redis.setEx(
      "supportedCollections",
      604800,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
