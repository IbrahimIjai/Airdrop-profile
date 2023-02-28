import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import { ImImage } from "react-icons/im";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import styles from "./Styles.module.css";
import { useState } from "react";
import Notification, { ACTIONS } from "../Notifications/Notification";

function ImageUpload({ setHash, setFilesURL }) {
  const [loading, setLoading] = useState(false);
  const projectId = "2L3hfaFdFaFxIDyNHs8ZkI4VjNz";
  const projectSecret = "468da4e808fcf648c74d7ac2c50771d0";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const handleFileChange = async (event) => {
    setLoading(true);
    event.preventDefault();
    const file = event.target.files[0];
    const addedFile = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    const url = `https://ipfs.io/ipfs/${addedFile.path}`;
    setHash(addedFile.path);
    url && setFilesURL(url);
    setLoading(false);
  };
  const handleDrop = async (e) => {
    setLoading(true);
    let file = e.dataTransfer.files[0];
    const addedFile = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    const url = `https://ipfs.io/ipfs/${addedFile.path}`;
    url && setFilesURL(url);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <Notification
          action={{
            type: ACTIONS.MESSAGE,
            payload: "Preprocessing your image",
          }}
        />
      ) : null}
      <div className={styles.imageInput}>
        <label htmlFor="input">
          <p>Select Image</p>
          <span>
            <ImImage />
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            onDrop={handleDrop}
            id="input"
          />
        </label>
      </div>
      {loading && (
        <div className={styles.loadingModal}>
          <div className={styles.internalLoadingModal}>
            <ClimbingBoxLoader
              color="#2fc0db"
              speedMultiplier={1}
              loading
              cssOverride={override}
              size={30}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
