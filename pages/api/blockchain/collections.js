import { createClient } from "redis";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  FETCH,
  fetchCollection,
  ipfsUri,
  REDIS,
  server,
  SUBGRAPH,
} from "../../../utils/utils";

const nftData = `
  query allCollections($address: ID) {
    collection(id: $address) {
      name
      id
      symbol
      totalSupply
    }
  }
`;

async function blockCall() {
  let url = `${server}/api/blockchain/supportedcollections`;
  const addresses = await FETCH(url);
  const arrayData = [];
  const data = [];
  const array = addresses.map((collection) => collection.toLowerCase());
  for (let i = 0; i < array.length; i++) {
    const client = new ApolloClient({
      uri: SUBGRAPH,
      cache: new InMemoryCache(),
    });
    await client
      .query({
        query: gql(nftData),
        variables: {
          address: array[i],
        },
      })
      .then((data) => {
        let content = data.data.collection;
        arrayData.push(content);
      })
      .catch((err) => console.log("Error fetching data: ", err));
  }
  for (let i = 0; i < arrayData.length; i++) {
    // const links = await fetchCollection(array[i]);
    let collection = array[i];
    let url = `${server}/api/mongo/${collection}/fetchcollection`;
    let data = await FETCH(url);
    const { placeholder, small, name } = links;
    const placeholderImage = ipfsUri(placeholder);
    const smallImage = ipfsUri(small);
    const obj = {
      ...arrayData[i],
      name: name,
      placeholderImage,
      smallImage,
      id: array[i],
    };
    data.push(obj);
  }
  return data;
}

export default async function handler(req, res) {
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall();
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const data = await redis.get("collections");
  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    const returnData = await blockCall();
    await redis.setEx("collections", 604800, JSON.stringify(returnData));
    res.status(200).json(returnData);
  }
  await redis.quit();
}
