import { create } from "ipfs-http-client";
import { useState, useRef } from "react";
import Image_ from "../ImageComponent/Image";
import styles from "./styles.module.css";
import defaultpics from "./ppp.png";

export default function Input({ onFileChange }) {
  const wrapperRef = useRef();
  const [fileList, setFileList] = useState([]);
  const [opacity, setOpacity] = useState(false);
  const [displaypics, setDisplayPics] = useState(defaultpics);
  const onDragEnter = () => setOpacity(true);
  const onDragLeave = () => setOpacity(false);
  const onDrop = () => setOpacity(false);

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

  const onFileDrop = (e) => {
    e.preventDefault();
    const newFile = e.target.files[0];
    // if (newFile) {
    //   const updatedList = [newFile];
    //   setFileList(updatedList);
    //   onFileChange(updatedList);
    //   //   const x = `/newFile.name`
    //   setDisplayPics(newFile);
    // }
  };

  return (
    <div
      ref={wrapperRef}
      style={{ opacity: opacity ? 0.6 : 1 }}
      className={styles.inputContainer}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}>
      <Image_ width={150} height={150} source={displaypics} />
      <label>Click to upload</label>
      <input type="file" value="" onChange={onFileDrop} />
    </div>
  );
}
