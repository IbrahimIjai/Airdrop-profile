import { createClient } from "redis";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
// import { REDIS, SUBGRAPH } from "../../../utils/utils";
import { REDIS, SUBGRAPH } from "../../utils/utils"
const dataQuery = `
 query queryData($address: ID) {
  account(id: $address) {
    points
  }
}`;

async function blockCall(profile) {
  let array;
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
    .then((data) => (array = data.data.account))
    .catch((err) => console.log("Error fetching data: ", err));

  return array;
}
export default async function handler(req, res) {
  const { profile } = req.query;
  const redis = createClient({ url: REDIS });

  redis.on("error", async (err) => {
    const returnData = await blockCall(profile);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const nullPoints = await redis.get(`${profile}/nullPoints`);
  if (nullPoints) {
    res.json(JSON.parse(nullPoints));
  } else {
    const returnData = await blockCall(profile);
    await redis.setEx(
      `${profile}/nullPoints`,
      600,
      JSON.stringify(returnData),
    );
    res.json(returnData);
  }
  await redis.quit();
}
