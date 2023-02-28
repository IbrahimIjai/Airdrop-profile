import Image from "next/image";
export default function Image_({height, width, source}) {
  return (
    <div style={{position:"relative", height:height, width: width, overflow:"hidden", borderRadius:"20px" }}>
      <Image src={source} objectFit="cover" layout="fill" alt="Profile pics" />
    </div>
  );
}
