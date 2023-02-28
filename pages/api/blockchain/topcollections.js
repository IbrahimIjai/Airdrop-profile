import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { utils } from "ethers";
import { createClient } from "redis";
import {
  fetchCollection,
  ipfsUri,
  MarketplaceInstance,
  REDIS,
  SUBGRAPH,
} from "../../../utils/utils";

const collectionDataQuery = `
query MyQuery ($address: ID){
  collection(id: $address) {
    id
    name
    totalSupply
    totalVolume
    totalSales
    topSale
  }
}
`;

async function blockCall(address) {
  const collectionsDetails = [];
  for (let i = 0; i < address.length; i++) {
    let object;
    const results = await MarketplaceInstance.getAllListings(address[i]);
    if (results.length > 0) {
      const client = new ApolloClient({
        uri: SUBGRAPH,
        cache: new InMemoryCache(),
      });
      await client
        .query({
          query: gql(collectionDataQuery),
          variables: {
            address: address[i].toLowerCase(),
          },
        })
        .then((data) => (object = data.data.collection))
        .catch((err) => console.log("Error fetching data: ", err));

      const ipfsData = await fetchCollection(address[i]);
      const image = ipfsUri(ipfsData.small);
      const prices = results.map((listing) => utils.formatEther(listing[1]));
      const lowestValue =
        prices.length > 0 &&
        prices.reduce((acc, cur) => (Number(acc) < Number(cur) ? acc : cur));
      const obj = {
        image,
        floor: lowestValue,
        items: prices.length,
        name: object.name,
        address: object.id,
        topSale: object.topSale,
        totalSupply: object.totalSupply,
        totalSales: object.totalSales,
        totalVolume: object.totalVolume,
      };
      collectionsDetails.push(obj);
    }
  }
  return collectionsDetails;
}

export default async function handler(req, res) {
  const address = req.body;
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall(address);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const data = await redis.get("topCollections");
  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    const returnData = await blockCall(address);
    await redis.setEx("topCollections", 3600, JSON.stringify(returnData));
    res.status(200).json(returnData);
  }
  await redis.quit();
}
