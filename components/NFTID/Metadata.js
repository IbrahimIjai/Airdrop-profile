import styles from "../../styles/nftId.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { attributesBody, _attributes } from "../../utils/framermotion/NFTID";
import { useContext } from "react";
import { NFTContext } from "../../pages/collection/[collection]/[nftId]";
export default function Metadata() {
  const { ipfsData } = useContext(NFTContext);
  const { attributes, description } = ipfsData
    ? ipfsData
    : { attributes: [], description: "" };
  return (
    <>
      <div className={styles.nftMetadata}>
        <div className={styles.box}>
          <motion.div
            // variants={Attribute}
            // initial="init"
            // animate={{}}
            // whileInView="final"
            // transition={{duration:2}}
            className={styles.head}
          >
            <h2>Attributes</h2>
            <hr />
          </motion.div>
          <div className={styles.body}>
            <div className={styles.bodyContainer}>
              <AnimatePresence>
                <motion.div
                  variants={attributesBody}
                  initial="init"
                  whileInView="final"
                  // whileViewport
                  viewport={{ once: true }}
                  className={styles.bodyAttributes}
                >
                  {attributes?.map((data, i) => (
                    <motion.aside variants={_attributes} key={i}>
                      <div>
                        <h2>
                          {data.trait_type
                            ? data.trait_type
                            : data.traitType
                            ? data.traitType
                            : data.trait_value}
                        </h2>{" "}
                        <p>{data.value}</p>
                      </div>
                    </motion.aside>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.head}>
            <h2>Description</h2>
            <hr />
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ onece: true }}
            className={styles.body}
          >
            <div className={styles.bodyContainer}>
              <div className={styles.bodyContent}>{description}</div>
            </div>
          </motion.div>
        </div>{" "}
      </div>
    </>
  );
}
