import { createClient } from "redis";
import { FETCH, REDIS, server } from "../../../utils/utils";

async function blockCall(type, inc) {
  let url = `${server}/api/mongo/fetchnfts?type=${type}&inc=${inc}`;
  let explore = await FETCH(url);
  return explore;
}

export default async function handler(req, res) {
  const { type, inc } = req.query;
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall(type, inc);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const explore = await redis.get(`explore/${type}/${inc}`);
  if (explore && explore.length > 0) {
    res.status(200).json(JSON.parse(explore));
    return;
  } else {
    const returnData = await blockCall(type, inc);
    await redis.setEx(
      `explore/${type}/${inc}`,
      3600,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
