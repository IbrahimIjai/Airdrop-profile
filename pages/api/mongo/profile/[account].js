import { createClient } from "redis";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  provider,
  REDIS,
  SUBGRAPH,
  MONGO,
  num,
  ipfsUri,
} from "../../../../utils/utils";
import { MongoClient } from "mongodb";

const dataQuery = `
 query queryData($address: ID) {
  account(id: $address) {
    tokens {
      identifier
      collection{
        id
      }
    }
  }
}`;

async function blockCall(profile) {
  const code = await provider.getCode(profile);
  let accountTokens;
  if (code === "0x") {
    const client = new ApolloClient({
      uri: SUBGRAPH,
      cache: new InMemoryCache(),
    });
    await client
      .query({
        query: gql(dataQuery),
        variables: {
          address: profile.toLowerCase(),
        },
      })
      .then((data) => {
        let temp = data.data.account.tokens;
        accountTokens = temp;
      })
      .catch((err) => console.log("Error fetching data: ", err));
  }
  let indexValue = null;
  if (accountTokens.length > 0) {
    const index = Math.floor(Math.random() * accountTokens.length);
    indexValue = index;
  }
  const collectionMap = {};
  accountTokens.forEach((obj) => {
    if (!collectionMap[obj.collection.id]) {
      collectionMap[obj.collection.id] = [];
    }
    collectionMap[obj.collection.id].push(num(obj.identifier));
  });
  const tokens = await callMongo(collectionMap);
  const dataObject = {
    tokens,
    code,
    indexValue,
  };
  return dataObject;
}

export default async function handler(req, res) {
  const { account } = req.query;
  const redis = createClient({ url: REDIS });

  redis.on("error", async (err) => {
    const returnData = await blockCall(account);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const profileData = await redis.get(`${account}/profiledata`);
  if (profileData) {
    res.json(JSON.parse(profileData));
  } else {
    const returnData = await blockCall(account);
    await redis.setEx(
      `${account}/profiledata`,
      600,
      JSON.stringify(returnData)
    );
    res.json(returnData);
  }
  await redis.quit();
}
async function callMongo(collectionMap) {
  const client = new MongoClient(MONGO);
  try {
    await client.connect();
    let array = await fetchTokens(client, collectionMap, 0);
    let data = array.map((arr) => {
      const img = ipfsUri(arr.image);
      let newArr = {
        ...arr,
        image: img,
        tokenId: arr._id,
        collection: arr.collection,
      };
      delete newArr._id;
      return newArr;
    });
    return data;
  } catch (err) {
    console.error(err);
    return "Error fetching";
  } finally {
    await client.close();
  }
}

async function fetchTokens(client, cMap, inc = 0) {
  const db = client.db("collections");
  const projection = {
    name: 1,
    image: 1,
    _id: 1,
    validity: 1,
    salePrice: 1,
    seller: 1,
    startingBid: 1,
    highestBid: 1,
    timestamp: 1,
    state: 1,
    offers: 1,
  };
  let data = [];
  const options = { projection, sort: { _id: 1 } };
  for (const [collectionName, idArray] of Object.entries(cMap)) {
    const col = db.collection(collectionName);
    const newData = await col
      .find({ _id: { $in: idArray } }, options)
      .toArray();
    newData.forEach((obj) => {
      obj.collection = collectionName;
      data.push(obj);
    });
  }
  return data;
}
// fetch an account nftData
