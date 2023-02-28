import {
  WKCSABI,
  marketplaceABI,
  AuctionABI,
  NFTABI,
  OffersABI,
} from "../../constants/ABIs";
import { Contract, utils } from "ethers";
import {
  MARKETPLACE,
  AUCTION,
  WKCS,
  OFFERS,
  low,
  WKCSInstance,
} from "../../utils/utils";

const genericAmount = "1000000000000000000000";

const approveWKCS = async (signer, amount, contract) => {
  try {
    const account = await signer.getAddress();
    const balance = await WKCSInstance.balanceOf(account);
    const userBalance = utils.formatEther(balance);
    const wkcs = new Contract(WKCS, WKCSABI, signer);
    const value = utils.formatEther(amount);
    if (Number(userBalance) >= Number(value)) {
      const approved = await wkcs.allowance(account, contract);
      const approvedAmount = utils.formatEther(approved);
      if (Number(approvedAmount) < Number(value)) {
        const approval = await wkcs.approve(contract, genericAmount);
        await approval.wait();
        return approval.hash;
      }
    } else throw new Error("Insufficient funds");
  } catch (error) {
    console.log(error);
  }
};
export const approveNFT = async (signer, collection, nftId, contract) => {
  try {
    const instance = new Contract(collection, NFTABI, signer);
    const approved = await instance.getApproved(nftId);
    if (low(approved) !== contract) {
      const approval = await instance.approve(contract, nftId);
      await approval.wait();
    }
  } catch (error) {
    console.log(error);
  }
};
export const buyTokenKCS = async (signer, collection, nftId, value) => {
  try {
    const contract = new Contract(MARKETPLACE, marketplaceABI, signer);
    const tx = await contract.buyWithKCS(collection, nftId, { value });
    await tx.wait();
    return tx.hash;
  } catch (e) {
    console.log(e);
  }
};
export const buyTokenWKCS = async (signer, price, collection, nftId) => {
  try {
    await approveWKCS(signer, price, MARKETPLACE);
    const contract = new Contract(MARKETPLACE, marketplaceABI, signer);
    const tx = await contract.buyWithWKCS(collection, nftId, price);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.log(error);
  }
};
export const list = async (signer, price, collection, nftId) => {
  try {
    await approveNFT(signer, collection, nftId, MARKETPLACE);
    const contract = new Contract(MARKETPLACE, marketplaceABI, signer);
    const tx = await contract.list(collection, nftId, price);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.log(error);
  }
};
export const cancelListing = async (signer, collection, nftId) => {
  try {
    const contract = new Contract(MARKETPLACE, marketplaceABI, signer);
    const tx = await contract.cancelListing(collection, nftId);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.log(err);
  }
};
export const updateListing = async (signer, price, collection, nftId) => {
  try {
    const contract = new Contract(MARKETPLACE, marketplaceABI, signer);
    const tx = await contract.updateListing(collection, nftId, price);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.log(error);
  }
};
export const createOfferKCS = async (
  signer,
  value,
  collection,
  nftId,
  validity
) => {
  try {
    const contract = new Contract(OFFERS, OffersABI, signer);
    const tx = await contract.createOfferWithKCS(collection, nftId, validity, {
      value,
    });
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.log(error);
  }
};
export const createOfferWKCS = async (
  signer,
  amount,
  collection,
  nft,
  validity
) => {
  try {
    await approveWKCS(signer, amount, OFFERS);
    const contract = new Contract(OFFERS, OffersABI, signer);
    const tx = await contract.createOfferWithKCS(
      collection,
      nft,
      amount,
      validity
    );
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.log(error);
  }
};
export const updateOfferKCS = async (signer, value, collection, nftId) => {
  try {
    await approveWKCS(signer, value, OFFERS);
    const contract = new Contract(OFFERS, OffersABI, signer);
    const tx = await contract.updateOfferWithKCS(collection, nftId, { value });
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.log(error);
  }
};
export const updateOfferWKCS = async (signer, amount, collection, nftId) => {
  try {
    await approveWKCS(signer, amount, OFFERS);
    const contract = new Contract(OFFERS, OffersABI, signer);
    const tx = await contract.updateOfferWithWKCS(collection, nftId, amount);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.log(error);
  }
};
export const cancelOffer = async (signer, collection, nftId) => {
  try {
    const contract = new Contract(OFFERS, OffersABI, signer);
    const tx = await contract.cancelOffer(collection, nftId);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.log(error);
  }
};
export const acceptOffer = async (signer, collection, nftId, initiator) => {
  try {
    await approveNFT(signer, collection, nftId, OFFERS);
    const contract = new Contract(OFFERS, OffersABI, signer);
    const tx = await contract.acceptOffer(collection, nftId, initiator);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.log(error);
  }
};
export const collectionOfferKCS = async (
  signer,
  collection,
  value,
  count,
  validity
) => {
  try {
    const contract = new Contract(OFFERS, OffersABI, signer);
    const tx = await contract.createCOWithKCS(collection, count, validity, {
      value,
    });
    await tx.wait();
    return tx.hash;
  } catch (e) {
    console.log(e);
  }
};
export const collectionOfferWKCS = async (
  signer,
  collection,
  value,
  count,
  validity
) => {
  try {
    await approveWKCS(signer, value, OFFERS);
    const contract = new Contract(OFFERS, OffersABI, signer);
    console.log(validity);
    const tx = await contract.createCOWithWKCS(
      collection,
      value,
      count,
      validity
    );
    await tx.wait();
    return tx.hash;
  } catch (e) {
    console.log(e);
  }
};
export const cancelCollectionOffer = async (signer, collection) => {
  const contract = new Contract(OFFERS, OffersABI, signer);
  const tx = await contract.cancelCollectionOffer(collection);
  await tx.wait();
  return tx.hash;
};
export const instantSale = async (signer, collection, nftId, buyer) => {
  await approveNFT(signer, collection, nftId, OFFERS);
  const contract = new Contract(OFFERS, OffersABI, signer);
  const tx = await contract.instantSell(buyer, collection, nftId);
  await tx.wait();
  return tx.hash;
};
export const cancelAuction = async (signer, collection, nftId) => {
  try {
    const contract = new Contract(AUCTION, AuctionABI, signer);
    const tx = await contract.cancelAuction(collection, nftId);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.log(err);
  }
};
export const acceptBid = async (signer, collection, nftId) => {
  try {
    const contract = new Contract(AUCTION, AuctionABI, signer);
    const tx = await contract.acceptBid(collection, nftId);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.log(err);
  }
};
export const createAuction = async (signer, collection, nftId, bid, end) => {
  try {
    await approveNFT(signer, collection, nftId, AUCTION);
    const contract = new Contract(AUCTION, AuctionABI, signer);
    const tx = await contract.createAuction(collection, nftId, bid, end);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.log(err);
  }
};
export const bidInKCS = async (signer, collection, nftId, bid) => {
  try {
    const contract = new Contract(AUCTION, AuctionABI, signer);
    const tx = await contract.createBidWithKCS(collection, nftId, {
      value: bid,
    });
    await tx.wait();
    return tx.hash;
  } catch (e) {
    console.log(e);
  }
};
export const bidInWKCS = async (signer, collection, nftId, bid) => {
  try {
    await approveWKCS(signer, bid, AUCTION);
    const contract = new Contract(AUCTION, AuctionABI, signer);
    const tx = await contract.createBidWithWKCS(collection, nftId, bid);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.log(err);
  }
};
export const FUNCTIONS = {
  BUY: "buy",
  SELL: "sell",
  BUYINKCS: "buy with kcs",
  BUYINWKCS: "buy with wkcs",
  CANCELLISTING: "cancel listing",
  UPDATELISTING: "update listing",
  CREATEOFFER: "create",
  CREATEOFFERKCS: "create with kcs",
  CREATEOFFERWKCS: "create with wkcs",
  UPDATEOFFER: "update offer",
  UPDATEOFFERKCS: "update offer in kcs",
  UPDATEOFFERWKCS: "update offer in wkcs",
  CANCELOFFER: "cancel offer",
  ACCEPTOFFER: "Accept offer",
  APPROVENFT: "approve nft",
  COLLECTIONOFFER: "create collection offer",
  COLLECTIONOFFERKCS: "create collection offer with kcs",
  COLLECTIONOFFERWKCS: "create collection offer with wkcs",
  CANCELCOLLECTIONOFFER: "cancel collection offer",
  INSTANTSALE: "instant sale",
  CREATEAUCTION: "create auction",
  ACCEPTBID: "close auction",
  MAKEBID: "make bid",
  MAKEBIDKCS: "make bid in kcs",
  MAKEBIDWKCS: "make bid in wkcs",
  CANCELAUCTION: "cancel auction",
};
