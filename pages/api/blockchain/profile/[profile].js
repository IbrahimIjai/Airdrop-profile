import { createClient } from "redis";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  FETCH,
  provider,
  REDIS,
  server,
  SUBGRAPH,
} from "../../../../utils/utils";

const dataQuery = `
 query queryData($address: ID, $collections: String) {
  account(id: $address) {
    tokens(where: {collection: $collections}) {
      identifier
      tokenURI
      collection{
        id
      }
    }
  }
}`;

async function blockCall(profile) {
  const code = await provider.getCode(profile);
  let url = `${server}/api/blockchain/supportedcollections`;
  const collections = await FETCH(url);
  const dataArray = [];
  if (code === "0x") {
    for (let i = 0; i < collections.length; i++) {
      const client = new ApolloClient({
        uri: SUBGRAPH,
        cache: new InMemoryCache(),
      });
      await client
        .query({
          query: gql(dataQuery),
          variables: {
            address: profile.toLowerCase(),
            collections: collections[i].toLowerCase(),
          },
        })
        .then((data) => {
          let temp = data.data.account.tokens;
          temp.length > 0 && dataArray.push(...temp);
        })
        .catch((err) => console.log("Error fetching data: ", err));
    }
  }
  let indexValue = null;
  if (dataArray.length > 0) {
    const index = Math.floor(Math.random() * dataArray.length);
    indexValue = index;
  }
  const dataObject = {
    dataArray,
    code,
    indexValue,
  };
  return dataObject;
}

export default async function handler(req, res) {
  const { profile } = req.query;
  const redis = createClient({ url: REDIS });

  redis.on("error", async (err) => {
    const returnData = await blockCall(profile);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const profileData = await redis.get(`${profile}/profiledata`);
  if (profileData) {
    res.json(JSON.parse(profileData));
  } else {
    const returnData = await blockCall(profile);
    await redis.setEx(
      `${profile}/profiledata`,
      600,
      JSON.stringify(returnData)
    );
    res.json(returnData);
  }
  await redis.quit();
}
