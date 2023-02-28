import { NFTABI } from "../../../../../../constants/ABIs";
import { Contract, utils } from "ethers";
import { createClient } from "redis";
import {
  FETCH,
  ipfsUri,
  MarketplaceInstance,
  provider,
  REDIS,
} from "../../../../../../utils/utils";

async function blockCall(nft, collection) {
  const contract = MarketplaceInstance;
  const instance = new Contract(collection, NFTABI, provider);
  const listings = await contract.getCollectionRecentListings(collection);
  const recentNFTListings = [];
  for (let i = 0; i < listings.length; i++) {
    const tokenId = listings[i][3].toNumber();
    if (tokenId !== Number(nft)) {
      const tokenDetails = await instance.tokenURI(tokenId);
      const ipfsLink = ipfsUri(tokenDetails);
      const { image, name } = await FETCH(ipfsLink);
      const imageUrl = ipfsUri(image);
      const obj = {
        image: imageUrl,
        name: name,
        value: utils.formatEther(listings[i][1]),
        tokenId,
      };
      recentNFTListings.push(obj);
    }
  }
  return recentNFTListings;
}

export default async function handler(req, res) {
  const { nft, collection } = req.query;
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall(nft, collection);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const data = await redis.get(`${collection}/${nft}/extralistings`);
  if (data) {
    res.json(JSON.parse(data));
  } else {
    const returnData = await blockCall(nft, collection);
    await redis.setEx(
      `${collection}/${nft}/extralistings`,
      300,
      JSON.stringify(returnData)
    );
    res.json(returnData);
  }
  await redis.quit();
}
