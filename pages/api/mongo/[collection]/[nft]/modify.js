import { MongoClient } from "mongodb";
import { FUNCTIONS } from "../../../../../components/NFTID/Functions";
import { zeroAddress, MONGO } from "../../../../../utils/utils";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { type, nft, collection } = req.query;
    const data = req.body;
    console.log(type, nft, collection, data);
    const client = new MongoClient(MONGO);
    try {
      await client.connect();
      const response = await update(
        client,
        type,
        collection.toLowerCase(),
        Number(nft),
        data
      );
      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json("Error fetching");
    } finally {
      await client.close();
    }
  } else if (req.method === "DELETE") {
    const { type, nft, collection } = req.query;
    console.log(type, nft, collection);
    const client = new MongoClient(MONGO);
    try {
      await client.connect();
      const response = await update(
        client,
        type,
        collection.toLowerCase(),
        Number(nft)
      );
      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json("Error fetching");
    } finally {
      await client.close();
    }
  }
}

async function update(client, type, collection, nft, body) {
  const collections = client.db("collections").collection(collection);
  let data;
  let validity;
  const time = new Date().getTime();
  const timestamp = time / 1000;
  switch (type) {
    case FUNCTIONS.SELL:
      data = await collections.updateOne(
        { _id: nft },
        {
          $set: {
            ...body,
            timestamp,
            state: "fixedSale",
          },
        }
      );
      break;
    case FUNCTIONS.BUY:
      data = await clearData(collections, nft);
      break;
    case FUNCTIONS.CANCELLISTING:
      data = await clearData(collections, nft);
      break;
    case FUNCTIONS.UPDATELISTING:
      data = await collections.updateOne(
        { _id: nft },
        { $set: { salePrice: body.salePrice } }
      );
      break;
    case FUNCTIONS.CREATEOFFER:
      validity = getUnix(body.validity);
      data = await collections.updateOne(
        {
          _id: nft,
          offers: {
            $not: { $elemMatch: { offerCreator: body.offerCreator } },
          },
        },
        { $push: { offers: { ...body, validity } } }
      );
      break;
    case FUNCTIONS.UPDATEOFFER:
      data = await collections.updateOne(
        {
          _id: nft,
          offers: { $elemMatch: { offerCreator: body.offerCreator } },
        },
        { $set: { "offers.$.offerValue": body.offerValue } }
      );
      break;
    case FUNCTIONS.CANCELOFFER:
      data = await collections.updateOne(
        { _id: nft },
        { $pull: { offers: { offerCreator: body.offerCreator } } }
      );
      break;
    case FUNCTIONS.ACCEPTOFFER:
      data = await collections.updateOne(
        { _id: nft },
        { $pull: { offers: { offerCreator: body.offerCreator } } }
      );
      await clearData(collections, nft);
      break;
    case FUNCTIONS.CREATEAUCTION:
      validity = getUnix(body.validity);
      data = await collections.updateOne(
        { _id: nft },
        {
          $set: {
            ...body,
            timestamp,
            validity,
            state: "auctionSale",
          },
        }
      );
      break;
    case FUNCTIONS.CANCELAUCTIONABRUPTLY:
      data = await clearData(collections, nft);
      break;
    case FUNCTIONS.CANCELAUCTION:
      data = await clearData(collections, nft);
      break;
    case FUNCTIONS.ACCEPTBID:
      data = await clearData(collections, nft);
      break;
    case FUNCTIONS.MAKEBID:
      data = await collections.updateOne(
        { _id: nft },
        {
          $set: {
            highestBid: body.highestBid,
            highestBidder: body.highestBidder,
          },
          $push: {
            bids: {
              ...body.bid,
            },
          },
        }
      );
      break;
    default:
      data = "Error";
      break;
  }
  return data;
}

async function clearData(collections, nft) {
  return await collections.updateOne(
    { _id: nft },
    {
      $set: {
        salePrice: null,
        startingBid: null,
        seller: zeroAddress,
        highestBid: null,
        highestBidder: null,
        timestamp: null,
        validity: null,
        state: "none",
        bids: [],
      },
    }
  );
}

export function getUnix(days) {
  let now = new Date();
  let sevenDaysFromNow = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  let unixTime = Math.round(sevenDaysFromNow.getTime() / 1000);
  return unixTime;
}

// All sells should contain a seller and a salePrice in its object
// buy, cancelListing takes no body
// updateListing takes a salePrice in its object body
// create offer contains offerValue, offerCreator and validity
// updateOffer contains offerValue and offerCreator
// cancelOffer and acceptOffer takes offerCreator
// createAuction takes seller, startingBid and validity
// cancelAuction, and acceptBid takes no body
// makeBids takes highestBid, highestBidder, bid object containing bidder and bid
// type should be set to the url e.g modify?type=buy
// create a custom utils class for setting the bosy of the put request
/*
var axios = require('axios');
var data = JSON.stringify({
  "offerValue": 23,
  "offerCreator": "0x2ca9ee122915e76a9e64f0c2eeb8c233397ed248",
  "validity": 93
});

var config = {
  method: 'put',
  url: 'http://localhost:3000/api/mongo/0xb26ba95b64d244afc0a73c439692ba24c84709b6/2/modify?type=create',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

*/
