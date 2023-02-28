import { createClient } from "redis";
import { FETCH, REDIS, server } from "../../../utils/utils";

async function blockCall() {
  let url = `${server}/api/mongo/fetchnfts?type=auctionSale`;
  let auctions = await FETCH(url);
  return auctions;
}

export default async function handler(req, res) {
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall();
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const recentAuctions = await redis.get(`recentAuctions`);
  if (recentAuctions) {
    res.status(200).json(JSON.parse(recentAuctions));
    return;
  } else {
    const returnData = await blockCall();
    await redis.setEx(`recentAuctions`, 3600, JSON.stringify(returnData));
    res.status(200).json(returnData);
  }
  await redis.quit();
}
/*

  let contract = AuctionInstance;
  const data = await contract.getRecentAuctions();
  const auctions = [];
  for (let i = 0; i < data.length; i++) {
    const instance = new Contract(data[i][1], NFTABI, provider);
    let tokenInfo = await instance.tokenURI(data[i][2].toString());
    let info = ipfsUri(tokenInfo);
    const json = await FETCH(info);
    const { name, image } = json;
    let imageFile = ipfsUri(image);
    let auction = {
      sellerAddress: data[i][0].toLowerCase(),
      collection: data[i][1].toLowerCase(),
      tokenId: data[i][2].toNumber(),
      salePrice: "0",
      startingBid: utils.formatEther(data[i][5]),
      closeAuctionTime: data[i][6].toString(),
      state: data[i][7],
      name,
      image: imageFile,
    };
    auctions.push(auction);
  } */
