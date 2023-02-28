import { utils } from "ethers";
import { createClient } from "redis";
import {
  FETCH,
  ipfsUri,
  MarketplaceInstance,
  MinterInstance,
  REDIS,
} from "../../../../../utils/utils";

async function blockCall(address) {
  const NFTData = await MinterInstance.getDistantNFTData(address);
  let baseUri = NFTData[3];
  baseUri = ipfsUri(baseUri);
  const link = await FETCH(`${baseUri}1.json`);
  const supply = NFTData[1].toNumber();
  const mintingFee = utils.formatEther(NFTData[5]);
  const maximumSupply = NFTData[6].toNumber();
  const maximumMint = NFTData[7].toNumber();
  const image = ipfsUri(link.image);
  const results = await MarketplaceInstance.getAllListings(address);
  let lowestValue;
  let prices;
  if (results.length > 0) {
    prices = results.map((listing) => utils.formatEther(listing[1]));
    lowestValue =
      prices.length > 0 &&
      prices.reduce((acc, cur) => (Number(acc) < Number(cur) ? acc : cur));
  }
  const obj = {
    floor: results.length > 0 ? lowestValue : null,
    item: results.length > 0 ? prices.length : null,
    contract: NFTData[0],
    totalSupply: supply,
    owner: NFTData[2],
    baseURI: NFTData[3],
    name: NFTData[4],
    image,
    mintFee: mintingFee,
    maxSupply: maximumSupply,
    maxMint: maximumMint,
    desc: link.description,
  };
  return obj;
}

export default async function handler(req, res) {
  const { address } = req.query;
  const redis = createClient({
    url: REDIS,
  });

  redis.on("error", async (err) => {
    const returnData = await blockCall(address);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const data = await redis.get(`mintedCollection/${address}`);
  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    const returnData = await blockCall(address);
    await redis.setEx(
      `mintedCollection/${address}`,
      360,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
