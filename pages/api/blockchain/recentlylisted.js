import { createClient } from "redis";
import { FETCH, REDIS, server } from "../../../utils/utils";

async function blockCall() {
  let url = `${server}/api/mongo/fetchnfts`;
  let recentListings = await FETCH(url);
  return recentListings;
}

export default async function handler(req, res) {
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    // console.log("Redis Client Error in Top Collections", err)
    const returnData = await blockCall();
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const data = await redis.get("recentListings");
  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    const returnData = await blockCall();
    await redis.setEx("recentListings", 3600, JSON.stringify(returnData));
    res.status(200).json(returnData);
  }
  await redis.quit();
}
/*

  const listings = await contract.getAllRecentListings();
  for (let i = 0; i < listings.length; i++) {
    const instance = new Contract(listings[i][2], NFTABI, provider);
    let tokenId = parseInt(listings[i][3]._hex, 16);
    let value = utils.formatEther(listings[i][1]);
    let tokenInfo = await instance.tokenURI(tokenId.toString());
    let info = ipfsUri(tokenInfo);
    const json = await FETCH(info);
    const { name, image } = json;
    let imageFile = ipfsUri(image);
    const obj = {
      tokenId: tokenId,
      collectionAddress: listings[i][2],
      address: listings[i][0],
      price: value,
      name: name,
      image: imageFile,
    };
    recentListings.push(obj);
  }
*/
