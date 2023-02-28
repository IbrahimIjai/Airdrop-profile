import { createClient } from "redis";
import { utils } from "ethers";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  AuctionInstance,
  FETCH,
  ipfsUri,
  REDIS,
  SUBGRAPH,
} from "../../../../../utils/utils";
const tokenDataQuery = `
query MyQuery ($address: ID){
  token(id: $address) {
    identifier
    tokenURI
    owner {
      id
    }
    collection {
      name
    }
  }
}
`;

async function blockCall(collection) {
  let contract = AuctionInstance;
  const data = await contract.getCollectionAuctions(collection);
  const auctions = [];
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      let object;
      let nft = data[i][2].toNumber();
      let collectionAddress = collection.toLowerCase();
      const client = new ApolloClient({
        uri: SUBGRAPH,
        cache: new InMemoryCache(),
      });
      await client
        .query({
          query: gql(tokenDataQuery),
          variables: {
            address: `ethereum/${collectionAddress}/${nft}`,
          },
        })
        .then((data) => (object = data.data.token))
        .catch((err) => console.log("Error fetching data: ", err));

      const tokenDetails = object.tokenURI;
      const ipfsLink = ipfsUri(tokenDetails);
      const { image, name } = await FETCH(ipfsLink);
      const imageLink = ipfsUri(image);

      let auction = {
        sellerAddress: data[i][0].toLowerCase(),
        salePrice: "0",
        highestBid: utils.formatEther(data[i][3]),
        highestBidder: data[i][4].toLowerCase(),
        startingBid: utils.formatEther(data[i][5]),
        closeAuctionTime: data[i][6].toString(),
        state: data[i][7],
        bids: data[i][8],
        fixedSale: false,
        tokenId: nft,
        collection,
        image: imageLink,
        name,
      };
      auctions.push(auction);
    }
  }
  return auctions;
}

export default async function handler(req, res) {
  const { collection } = req.query;
  const redis = createClient({ url: REDIS });

  redis.on("error", async (err) => {
    const returnData = await blockCall(collection.toLowerCase());
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const collectionDetails = await redis.get(`${collection}/auctionItems`);
  if (collectionDetails) {
    res.status(200).json(JSON.parse(collectionDetails));
    return;
  } else {
    const returnData = await blockCall(collection.toLowerCase());
    await redis.setEx(
      `${collection}/auctionItems`,
      300,
      JSON.stringify(returnData)
    );
    res.status(200).json(returnData);
  }
  await redis.quit();
}
