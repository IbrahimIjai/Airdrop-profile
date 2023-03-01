
import AirdropSection_1 from "../components/Airdrop/Section1";
import AirdropSection_2 from "../components/Airdrop/Section2";
import Howto from "../components/Airdrop/Section3";
export default function Home({ addresses }) {

  return (
    <main>
      <div>
        <AirdropSection_1  />
      </div>
      <div>
        <AirdropSection_2 />
      </div>
      <div id="How_to">
        <Howto/>
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
