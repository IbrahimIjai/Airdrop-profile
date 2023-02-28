import { createClient } from "redis";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { FETCH, ipfsUri, REDIS, SUBGRAPH } from "../../../../../utils/utils";

const dataQuery = `
query MyQuery($address: ID, $collections: String) {
  collection(id: $collections) {
    tokens(where: {owner_: {id: $address}}) {
      identifier
      tokenURI
    }
  }
}`;

async function blockCall(collection, account) {
  let tokens;
  const tokensData = [];
  const client = new ApolloClient({
    uri: SUBGRAPH,
    cache: new InMemoryCache(),
  });
  await client
    .query({
      query: gql(dataQuery),
      variables: {
        address: account.toLowerCase(),
        collections: collection.toLowerCase(),
      },
    })
    .then((data) => {
      let temp = data.data.collection.tokens;
      tokens = temp;
    })
    .catch((err) => console.log("Error fetching data: ", err));
  if (tokens.length > 0) {
    for (let i = 0; i < tokens.length; i++) {
      let uri = ipfsUri(tokens[i].tokenURI);
      const { image, name } = await FETCH(uri);
      let imageUrl = ipfsUri(image);
      let object = {
        image: imageUrl,
        name,
        id: tokens[i].identifier,
      };
      tokensData.push(object);
    }
  }
  return tokensData;
}
export default async function handler(req, res) {
  const { collection, account } = req.query;
  const redis = createClient({ url: REDIS });

  redis.on("error", async (err) => {
    const returnData = await blockCall(collection, account);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const userNfts = await redis.get(
    `${collection}/${account}/collectionOffersTokens`
  );
  if (userNfts) {
    res.status(200).json(JSON.parse(userNfts));
  } else {
    const returnData = await blockCall(collection, account);
    await redis.setEx(
      `${collection}/${account}/collectionOffersTokens`,
      300,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
