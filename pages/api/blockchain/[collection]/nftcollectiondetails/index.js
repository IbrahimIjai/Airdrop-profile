import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { utils } from "ethers";
import { createClient } from "redis";
import {
  FETCH,
  fetchCollection,
  ipfsUri,
  OFFERS,
  OffersInstance,
  REDIS,
  server,
  SUBGRAPH,
} from "../../../../../utils/utils";

const collectionDataQuery = `
  query collectionDataQuery($address: ID){
    collection(id: $address){
      name
      totalSupply
      totalVolume
    }
  }
`;

async function blockCall(collection) {
  let objectData = {};
  const client = new ApolloClient({
    uri: SUBGRAPH,
    cache: new InMemoryCache(),
  });
  await client
    .query({
      query: gql(collectionDataQuery),
      variables: {
        address: collection,
      },
    })
    .then((data) => {
      let content = data.data.collection;
      objectData = content;
    })
    .catch((err) => console.log("Error fetching data: ", err));
  // const data = await fetchCollection(collection);
  let url = `${server}/api/mongo/${collection}/fetchcollection`;
  let data = await FETCH(url);
  const offers = await OffersInstance.getCollectionTVL(collection);
  const offersTvl = utils.formatEther(offers);
  let nullObject = { totalSupply: 0, totalVolume: 0 };
  const { totalSupply, totalVolume } = objectData ? objectData : nullObject;
  const { name, description, banner, small, twitter, telegram, discord } = data;
  const bannerImage = ipfsUri(banner);
  const smallImage = ipfsUri(small);
  const obj = {
    totalSupply,
    totalVolume,
    offersTvl,
    name,
    description,
    bannerImage,
    smallImage,
    twitter,
    telegram,
    discord,
  };
  return obj;
}

export default async function handler(req, res) {
  const { collection } = req.query;
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall(collection.toLowerCase());
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const collectionDetails = await redis.get(`${collection}/details`);
  if (collectionDetails) {
    res.status(200).json(JSON.parse(collectionDetails));
    return;
  } else {
    const returnData = await blockCall(collection.toLowerCase());
    await redis.setEx(
      `${collection}/details`,
      1200,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
