import {
  marketplaceABI as MKABI,
  AuctionABI,
  WKCSABI,
  NFTABI,
  OffersABI,
} from "../constants/ABIs";
import { Contract, ethers } from "ethers";
import Cookies from "js-cookie";
const dev = false;

// Remember to set all contract addresses to lowerCase()
export const MARKETPLACE = "0x35a67582128082dd15be4401aaf5bdec9accba47";
export const AUCTION = "0x76f0614fbf65f4c8ed1a75e511b77f9cde78f43c";
// export const OFFERS = "0x1d53f73a60482fceedc4872fe82496b4b38a75aa";
export const OFFERS = "0xaf5969ec18a0ccb67ba5eb148a70e786801b76b7";
export const WKCS = "0x4446fc4eb47f2f6586f9faab68b3498f86c07521";
export const DCL = "0xe6058a58d94b25c0e12dba32879139e9c363969f";

export const rpc =
  "https://kcc.getblock.io/a785e1f6-78b5-4771-a0d6-942d2fa34737/mainnet/";
// add the other public rpc too one side
export const provider = new ethers.providers.JsonRpcProvider(rpc);
export const MarketplaceInstance = new Contract(MARKETPLACE, MKABI, provider);
export const WKCSInstance = new Contract(WKCS, WKCSABI, provider);
export const AuctionInstance = new Contract(AUCTION, AuctionABI, provider);
export const OffersInstance = new Contract(OFFERS, OffersABI, provider);
export const DCL_Instance = new Contract(DCL, NFTABI, provider);
export const collectionsHost =
  "https://ipfsfiles.distant.finance/ipfs/QmSr3cLvM3xiC7PycCPSzSCHkSChprPfAQkn25WUwiy5da";
export const SUBGRAPH = "https://thegraph.kcc.network/subgraphs/name/mart";
export const zeroAddress = "0x0000000000000000000000000000000000000000";
export const REDIS = `redis://default:iEWR1FHnlHpT8Ay8ZHdP4yBP1hSRTxCK@redis-19871.c258.us-east-1-4.ec2.cloud.redislabs.com:19871`;
export const MONGO =
  "mongodb+srv://Admin:Crypto4UsAdmin@cluster0.wh2adsu.mongodb.net/?retryWrites=true&w=majority";
export const server = dev
  ? "http://localhost:3000"
  : "https://marketplace.distant.finance";
export const FETCH = async (url) => {
  let data = await fetch(url)
    .then((res) => res.json())
    .catch((e) => console.log(e));
  return data;
};
export const POST = async (url, content) => {
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
  return data;
};
export const PUT = async (url, content) => {
  let data = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
    redirect: "follow",
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
  return data;
};
export const DELETE = async (url) => {
  let data = await fetch(url, {
    method: "DELETE",
    redirect: "follow",
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
  return data;
};

export const slice = (address) => {
  const account = address?.toLowerCase();
  return `${account?.slice(0, 5)}...${account?.slice(38, 42)}`;
};
export const low = (content) => content?.toLowerCase();
export const num = (content) => (content ? Number(content) : content);
export const ipfsUri = (url) =>
  url.includes("ipfs://", 0)
    ? url.replace("ipfs://", "https://ipfsfiles.distant.finance/ipfs/")
    : url;

export const fetchCollection = async (address) => {
  let collection = address.toLowerCase();
  let link = collectionsHost + `/${collection}.json`;
  let data = await FETCH(link);
  return data;
};

export function addToCart(coll, nftData, nftId) {
  let cart = getCart(coll);
  let totalCart = getCart("cart");
  totalCart.push(nftData);
  cart.push(nftId);
  Cookies.set(coll, JSON.stringify(cart), { expires: 7 });
  Cookies.set("cart", JSON.stringify(totalCart), { expires: 7 });
}
export function getCart(key) {
  let cart = Cookies.get(key);
  cart = cart ? JSON.parse(cart) : [];
  return cart;
}
export function remove(collection, nftId) {
  let cart = getCart(collection);
  let totalCart = getCart("cart");
  if (cart.length > 0) {
    let newCart = cart.filter((nft) => nft !== nftId);
    let newTotalCart = totalCart.filter((obj) => obj.tokenId !== nftId);
    totalCart.push(newTotalCart);
    Cookies.set(collection, JSON.stringify(newCart), { expires: 7 });
    Cookies.set("cart", JSON.stringify(totalCart), { expires: 7 });
  }
}
export function tokenExistsInCart(collection, tokenId) {
  let cart = getCart(collection);
  let exists = cart.includes(tokenId);
  return exists;
}
