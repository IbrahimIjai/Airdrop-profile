// import { contracts } from "../../../../../constants/ABIs";
// import { utils } from "ethers";
// import { createClient } from "redis";

// async function blockCall(address) {
//   const NFTData = await contracts.MinterInstance.getDistantNFTData(address);
//   const link = await fetch(NFTData[5])
//     .then((res) => res.json())
//     .catch((err) => console.log(err));
//   const supply = NFTData[1].toNumber();
//   const mintingFee = utils.formatEther(NFTData[6]);
//   const maximumSupply = NFTData[7].toNumber();
//   const maximumMint = NFTData[8].toNumber();
//   const image = link.image.replace(
//     "ipfs://",
//     "https://ipfsfiles.distant.finance/ipfs/"
//   );
//   const results = await contracts.MarketplaceInstance.getAllListings(address);
//   let lowestValue;
//   let prices;
//   if (results.length > 0) {
//     prices = results.map((listing) => utils.formatEther(listing[1]));
//     lowestValue =
//       prices.length > 0 &&
//       prices.reduce((acc, cur) => (Number(acc) < Number(cur) ? acc : cur));
//   }

//   let url = NFTData[5].replace("1.json", "");
//   const array = Array.from({ length: supply });
//   const metadata = array.map((data, i) => `${url}${i + 1}.json`);
//   const obj = {
//     floor: results.length > 0 ? lowestValue : null,
//     item: results.length > 0 ? prices.length : null,
//     contract: NFTData[0],
//     totalSupply: supply,
//     owner: NFTData[2],
//     symbol: NFTData[3],
//     name: NFTData[4],
//     image,
//     mintFee: mintingFee,
//     maxSupply: maximumSupply,
//     maxMint: maximumMint,
//     desc: link.description,
//     metadata,
//   };
//   return obj;
// }

// export default async function handler(req, res) {
//   const { address } = req.query;
//   const redis = createClient({
//     url: contracts.redis,
//   });
//   redis.on("error", async (err) => {
//     const returnData = await blockCall(address);
//     return res.status(200).json(returnData);
//   });
//   await redis.connect();
//   const data = await redis.get(`analysis/${address}`);
//   if (data) {
//     res.status(200).json(JSON.parse(data));
//   } else {
//     const returnData = await blockCall(address);
//     await redis.setEx(`analysis/${address}`, 360, JSON.stringify(returnData));
//     res.status(200).json(returnData);
//   }
//   await redis.quit();
// }
