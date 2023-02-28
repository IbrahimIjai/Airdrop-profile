import { NFTABI } from "../../../../../../constants/ABIs";
import { Contract, utils } from "ethers";
import {
  AuctionInstance,
  zeroAddress,
  MarketplaceInstance,
  provider,
  low,
} from "../../../../../../utils/utils";
export default async function handler(req, res) {
  const { nft, collection } = req.query;
  const contract = MarketplaceInstance;
  const auction = AuctionInstance;
  const NFT = new Contract(collection, NFTABI, provider);
  let owner = await NFT.ownerOf(nft);
  let saleInfo = await contract.getListing(collection, nft);
  let salePrice = "0.0";
  let seller = zeroAddress;
  let nftSaleInfo;
  if (saleInfo[0] !== zeroAddress) {
    salePrice = utils.formatEther(saleInfo[1]);
    seller = low(saleInfo[0]);
    nftSaleInfo = {
      seller,
      owner: low(owner),
      salePrice,
      saleType: "fixedSale",
    };
  } else {
    const auctionInfo = await auction.getAuctionData(collection, nft);
    if (auctionInfo[0] !== zeroAddress) {
      nftSaleInfo = {
        seller: low(auctionInfo[0]),
        salePrice,
        highestBid: utils.formatEther(auctionInfo[3]),
        highestBidder: low(auctionInfo[4]),
        startingBid: utils.formatEther(auctionInfo[5]),
        closeAuctionTime: auctionInfo[6].toString(),
        state: auctionInfo[7],
        bids: auctionInfo[8],
        saleType: "auctionSale",
      };
    } else {
      nftSaleInfo = { seller, owner: low(owner), salePrice, saleType: "none" };
    }
  }
  res.json(nftSaleInfo);
}
