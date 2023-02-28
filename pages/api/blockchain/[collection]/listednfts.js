import { NFTABI } from "../../../../constants/ABIs";
import { Contract } from "ethers";
import { createClient } from "redis";
import { FETCH, ipfsUri, provider, REDIS } from "../../../../utils/utils";

async function blockCall(listings, collection) {
  const arr = [];
  if (listings) {
    const contract = new Contract(collection, NFTABI, provider);
    const names = [];
    const imagelinks = [];
    for (let i = 0; i < listings.length; i++) {
      const tokenUri = await contract.tokenURI(listings[i].nftId);
      const link = ipfsUri(tokenUri);
      const data = await FETCH(link);
      const image = ipfsUri(data.image);
      names.push(data.name);
      imagelinks.push(image);
    }
    for (let i = 0; i < listings.length; i++) {
      const object = {
        tokenId: listings[i].nftId,
        seller: listings[i].address,
        price: listings[i].salePrice,
        image: imagelinks[i],
        name: names[i],
      };
      arr.push(object);
    }
  }
  return arr;
}

export default async function handler(req, res) {
  const listings = req.body;
  const { collection } = req.query;
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall(listings, collection);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const dataNfts = await redis.get(`${collection}/listedNfts`);
  if (dataNfts) {
    res.status(200).json(JSON.parse(dataNfts));
  } else {
    const returnData = await blockCall(listings, collection);
    await redis.setEx(
      `${collection}/listedNfts`,
      360,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
