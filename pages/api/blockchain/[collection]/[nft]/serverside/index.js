import { utils } from "ethers";
import { createClient } from "redis";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  AuctionInstance,
  zeroAddress,
  ipfsUri,
  MarketplaceInstance,
  REDIS,
  SUBGRAPH,
  low,
  FETCH,
} from "../../../../../../utils/utils";
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

async function blockCall(nft, collection) {
  const contract = MarketplaceInstance;
  const auction = AuctionInstance;
  let saleInfo = await contract.getListing(collection, nft);
  let salePrice = "0.0";
  let seller = zeroAddress;
  let nftSaleInfo;
  let object;
  let collectionAddress = low(collection);
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
  let owner = object.owner.id;
  if (saleInfo[0] !== zeroAddress) {
    salePrice = utils.formatEther(saleInfo[1]);
    seller = low(saleInfo[0]);
    nftSaleInfo = {
      seller,
      salePrice,
      owner: low(owner),
      saleType: "fixedSale",
    };
  } else {
    const auctionInfo = await auction.getAuctionData(collection, nft);
    if (auctionInfo[0] !== zeroAddress) {
      let bidArray = auctionInfo[8].map((bidArr) => ({
        bidder: low(bidArr[0]),
        bid: utils.formatEther(bidArr[1]),
      }));
      nftSaleInfo = {
        seller: low(auctionInfo[0]),
        salePrice,
        highestBid: utils.formatEther(auctionInfo[3]),
        highestBidder: low(auctionInfo[4]),
        startingBid: utils.formatEther(auctionInfo[5]),
        closeAuctionTime: auctionInfo[6].toString(),
        state: auctionInfo[7],
        bids: bidArray,
        saleType: "auctionSale",
      };
    } else {
      nftSaleInfo = { seller, owner: low(owner), salePrice, saleType: "none" };
    }
  }
  const ipfsLink = ipfsUri(tokenDetails);
  const { image, description, name, attributes } = await FETCH(ipfsLink);
  const imageLink = ipfsUri(image);
  const collectionName = object.collection.name;
  const ipfsData = {
    image: imageLink,
    description,
    name,
    attributes,
    collectionName,
  };
  const dataContainer = {
    ipfsData,
    nftSaleInfo,
  };
  return dataContainer;
}
export default async function handler(req, res) {
  const { nft, collection } = req.query;
  const redis = createClient({ url: REDIS });
  redis.on("error", async (err) => {
    const returnData = await blockCall(nft, collection);
    return res.status(200).json(returnData);
  });
  await redis.connect();
  const data = await redis.get(`${collection}/${nft}/server`);
  if (data) {
    res.json(JSON.parse(data));
  } else {
    const returnData = await blockCall(nft, collection);
    await redis.setEx(
      `${collection}/${nft}/server`,
      120,
      JSON.stringify(returnData)
    );
    res.json(returnData);
  }
  await redis.quit();
}
