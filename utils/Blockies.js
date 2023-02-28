import Blockies from "react-blockies";

export default function Blockie({ address, size }) {
  return (
    <Blockies
      seed={address}
      size={size ? size : 10}
      scale={3}
      color="#2fc0db"
      bgColor="#fff"
      spotColor="#000"
      className="identicon"
    />
  );
}
