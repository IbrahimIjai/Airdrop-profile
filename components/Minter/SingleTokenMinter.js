import { useState } from "react";
import styles from "./Styles.module.css";
import ImageUpload from "./UploadImage";
import Preview from "./Preview";
import { MdOutlineCancel } from "react-icons/md";
import { DCL_ABI } from "../../constants/ABIs";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { DCL, server } from "../../utils/utils";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function SingleTokenMinter() {
  const router = useRouter();
  const { active, library } = useWeb3React();
  const [filesURL, setFilesURL] = useState("");
  const [hash, setHash] = useState("");
  const [NFTName, setNFTName] = useState("");
  const [fee, setFee] = useState(0);
  const [NFTDescription, setNFTDescription] = useState("");
  const [attributeName, setAttributeName] = useState("");
  const [attribute, setAttribute] = useState("");
  const [properties, setProperties] = useState([]);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const addAttribute = () => {
    setProperties([
      ...properties,
      {
        id: count,
        attributeName,
        attribute,
      },
    ]);
    setCount(count + 1);
    setAttribute("");
    setAttributeName("");
  };
  const deleteAttribute = (id) => {
    let newArray = [];
    properties.map((property) => {
      property.id !== id && newArray.push(property);
    });
    setProperties(newArray);
  };
  const currentView = ["Select Image", "Token Details"];

  async function pushTokenData() {
    if (!active) throw new Error("Connect your wallet");
    setLoading(true);
    const signer = await library.getSigner();
    const contract = new Contract(DCL, DCL_ABI, signer);
    let _fee = fee * 100;
    const tx = await contract.mint(_fee);
    await tx.wait();
    let url = `${server}/api/mongo/uploadmetadata`;
    let object = {
      name: NFTName,
      description: NFTDescription,
      image: `ipfs://${hash}`,
      fee,
      attributes: properties,
      collection: "Distant Collections",
    };
    let res = await axios.post(url, object).catch((e) => {
      throw new Error();
    });
    console.log(res.data);
    setLoading(false);
    router.push(`/collection/${DCL}/${res.data}`);
  }

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loadingModal}>
          <div className={styles.internalLoadingModal}>
            <HashLoader
              color={"#ffffff"}
              loading={loading}
              cssOverride={override}
              size={50}
            />
            <p style={{ color: "white" }}>Transaction is being mined</p>
          </div>
        </div>
      )}
      <h3>Create a single collectible</h3>
      <div className={styles.currentView}>
        {currentView.map((view, i) => (
          <aside key={i}>
            <div>{view}</div>
            <span
              style={{
                background:
                  i === 0 && !filesURL
                    ? "#2fc0db"
                    : i === 1 && filesURL
                    ? "#2fc0db"
                    : "transparent",
              }}
            ></span>
          </aside>
        ))}
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.upLoad}>
          {!active ? (
            <div className={styles.not}>
              <h1>Connect your wallet to get started</h1>
            </div>
          ) : !filesURL ? (
            <ImageUpload setHash={setHash} setFilesURL={setFilesURL} />
          ) : (
            <Preview filesURL={filesURL} />
          )}
        </div>
        {filesURL ? (
          <div className={styles.data}>
            <div className={styles.inputSection1}>
              <input
                type="text"
                placeholder="Token Name, e.g Void NFT"
                value={NFTName}
                onChange={(e) => setNFTName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Token fee: 0% - 4%"
                title="Fill in the fee between 0-4% for every sale transaction of your NFT"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                required
              />
              <textarea
                type="text"
                placeholder="Token Description"
                value={NFTDescription}
                onChange={(e) => setNFTDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className={styles.attributesSection}>
              <p>Token attributes</p>
              {properties.length > 0 && (
                <div className={styles.propertiesDiv}>
                  {properties?.map((property) => {
                    return (
                      <div className={styles.property} key={property.id}>
                        <div>
                          <h3>{property.attributeName}</h3>
                          <p>{property.attribute}</p>
                        </div>
                        <span className={styles.deleteBtn}>
                          <MdOutlineCancel
                            size="1em"
                            onClick={() => deleteAttribute(property.id)}
                          />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className={styles.inputSection2}>
                <input
                  type="text"
                  placeholder="Attribute name; e.g Background"
                  value={attributeName}
                  onChange={(e) => setAttributeName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Attribute property; e.g White"
                  value={attribute}
                  onChange={(e) => setAttribute(e.target.value)}
                  required
                />
                {properties.length < 3 && (
                  <div className={styles.instructions}>
                    Add at least {3 - properties.length}{" "}
                    {properties.length > 0 && "more"}{" "}
                    {properties.length > 1 ? "property" : "properties"}
                  </div>
                )}
              </div>

              <div>
                {attribute !== "" && attributeName !== "" && (
                  <div onClick={addAttribute} className={styles.preview}>
                    <span>Add Property</span>
                  </div>
                )}

                {attribute === "" &&
                  attributeName === "" &&
                  properties.length > 2 && (
                    <div className={styles.preview} onClick={pushTokenData}>
                      <span>Mint</span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
