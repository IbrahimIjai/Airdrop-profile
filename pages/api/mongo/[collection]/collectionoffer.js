import { MongoClient } from "mongodb";
import { FUNCTIONS } from "../../../../components/NFTID/Functions";
import { MONGO } from "../../../../utils/utils";
import { getUnix } from "./[nft]/modify";

export default async function handler(req, res) {
  const { type, collection } = req.query;
  const data = req.body ? req.body : null;
  const client = new MongoClient(MONGO);
  try {
    await client.connect();
    await collectionOffer(client, type, collection.toLowerCase(), data);
    res.json("Complete");
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching");
  } finally {
    await client.close();
  }
}

async function collectionOffer(client, type, collection, body) {
  const collections = client.db("collections").collection("marketplace");
  const { offerCreator, offerValue, nftAmount } = body;
  let validity;
  let data;
  switch (type) {
    case FUNCTIONS.COLLECTIONOFFER:
      validity = getUnix(body.validity);
      data = await collections.updateOne(
        {
          _id: collection,
        },
        { $push: { collectionOffers: { ...body, validity } } }
      );
      break;
    case FUNCTIONS.CANCELCOLLECTIONOFFER:
      data = await collections.updateOne(
        { _id: collection, "collectionOffers.offerCreator": offerCreator },
        {
          $pull: { collectionOffers: { offerCreator: offerCreator } },
        }
      );
      break;
    case FUNCTIONS.INSTANTSALE:
      data = await collections.updateOne(
        { _id: collection, "collectionOffers.offerCreator": offerCreator },
        {
          $inc: {
            "collectionOffers.$.nftAmount": nftAmount,
            "collectionOffers.$.offerValue": offerValue,
          },
        }
      );
      const updatedDoc = await collections.findOne({ _id: collection });
      const offerIndex = updatedDoc.collectionOffers.findIndex(
        (offer) => offer.offerCreator === offerCreator
      );
      const offer = updatedDoc.collectionOffers[offerIndex];
      if (offer.nftAmount === 0) {
        await collections.updateOne(
          { _id: collection },
          { $pull: { collectionOffers: { offerCreator: offerCreator } } }
        );
      }
      break;
    default:
      data = "Error";
      break;
  }
  return data;
}

// Contained in the body should be an object which you will pass into an array. The type will determine what kinf of transaction to execute
// CollectionOffers type sends a body with offerCreator, offerValue, nftAmount, and validity
// CancelCollectionOffers sends offerCreator and deletes the object from the array
// InstantSale sends offerCreator, offerValue and nftAmount as negative values
