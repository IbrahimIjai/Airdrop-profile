// Buy Button styling
// Current Account is not owner, and the NFT is not listed
export const AddressNotOwnerNotListed = {
  transitionProperty: "none",
  transform: "none",
  boxShadow: "none",
  cursor: "default",
};
export const ReverseAddressNotOwnerNotListed = {
  transitionProperty: "",
  transform: "",
  boxShadow: "",
  cursor: "",
};
// Current account is owner, but NFT is not listed and approved for sale on the marketplace
export const OwnerNotListedApproved = {
  display: "none",
};
export const ReverseOwnerNotListedApproved = {
  display: "",
};
// Offers Button styling
// Current account is owner  but not listed
export const AddressOwnerNotListed = {
  cursor: "unset",
  transitionProperty: "none",
  transform: "none",
  corlor: "black",
  backgroundColor: "transparent",
};
export const ReverseAddressOwnerNotListed = {
  cursor: "",
  transitionProperty: "",
  transform: "",
  corlor: "",
  backgroundColor: "",
};
export const AddressNotOwnerButCreateOffer = {
  backgroundColor: "#e73434",
};
export const ReverseAddressNotOwnerButCreateOffer = {
  backgroundColor: "",
};
// All offers tab
//
export const AddressOwnerTokenListed = {
  backgroundColor: "black",
  cursor: "pointer",
  color: "white",
  borderRadius: "8px",
  border: "2px solid #000",
};

export const ReverseAddressOwnerTokenListed = {
  backgroundColor: "",
  cursor: "",
  color: "",
  borderRadius: "",
  border: "",
};
