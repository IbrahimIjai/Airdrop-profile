import Loader from "../components/LayoutDesign/Loader";
import useFirstLoad from "../hooks/useFirstLoad";
import { useState, useEffect } from "react";

import AirdropSection_1 from "../components/Airdrop/Section1";
import AirdropSection_2 from "../components/Airdrop/Section2";
export default function Home({ addresses }) {
  const [animate_, setAnimate] = useState(false);
  const isFirstLoad = useFirstLoad();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {isFirstLoad && <Loader />}
      <div>
        <AirdropSection_1 animate={animate_} />
      </div>
      <div>
        <AirdropSection_2 />
      </div>
    </main>
  );
}

// export async function getStaticProps() {
//   let url = `${server}/api/blockchain/supportedcollections`;
//   const addresses = await FETCH(url);
//   return {
//     props: {
//       addresses: addresses,
//     },
//     revalidate: 604800,
//   };
// }
