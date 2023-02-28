import { utils } from "ethers";
import { low, OffersInstance } from "../../../../../../utils/utils";
export default async function handler(req, res) {
  const { nft, collection, price } = req.query;
  const contract = OffersInstance;
  const offerInfo = await contract.getOffers(collection, nft);
  const offerValue = offerInfo.map((offer) => utils.formatEther(offer[1]));
  const priceDifference = [];
  const percentageDifference = () => {
    const saleValue = Number(price);
    offerValue.map((value) => {
      if (value > saleValue) {
        priceDifference.push((value / saleValue) * 100 - 100);
      } else if (value < saleValue) {
        priceDifference.push(-Math.abs((saleValue / value) * 100 - 100));
      } else {
        priceDifference.push(value - saleValue);
      }
    });
  };
  percentageDifference();
  const offers = [];
  const offerCreatorAddresses = [];
  for (let i = 0; i < offerInfo.length; i++) {
    let difference = priceDifference[i].toPrecision(4);
    let floorDifference = parseFloat(difference) > -100 ? difference : "-100.0";
    let object = {
      address: low(offerInfo[i][0]),
      value: Number(offerValue[i]),
      floorDifference,
    };
    offerCreatorAddresses.push(low(offerInfo[i][0]));
    offers.push(object);
  }
  const highestOffer =
    offerValue.length > 0
      ? offerValue.reduce((acc, cur) =>
          Number(acc) > Number(cur) ? Number(acc) : Number(cur)
        )
      : 0;
  const highestOfferObject =
    offerValue.length > 0
      ? offers.find((offer) => offer.value == highestOffer)
      : null;
  const offersData = {
    highestOffer,
    highestOfferCreator: highestOfferObject
      ? highestOfferObject.address.toLowerCase()
      : null,
    offers,
    offerCreatorAddresses,
  };
  res.json(offersData);
}
