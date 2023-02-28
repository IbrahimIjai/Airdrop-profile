import { useState, useRef, useEffect, useContext } from "react";
import styles from "../../styles/nft.module.css";
import { RxLightningBolt } from "react-icons/rx";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown, MdCheck } from "react-icons/md";
import useMediaQuery from "../../hooks/useMediaQueryhooks";
import { useWeb3React } from "@web3-react/core";
import KCS from "../../assets/KCS";
import { DataContext } from "../../pages/collection/[collection]";
import useDebounce from "../../hooks/useDebounce";
import { FETCH, server } from "../../utils/utils";
import Notification, { ACTIONS } from "../Notifications/Notification";
import useTimeout from "../../hooks/useTimeout";
const style = {
  display: "flex",
  gap: "2px",
  alignItems: "center",
};
export default function CollectionNavbar() {
  const { active } = useWeb3React();
  const {
    setView,
    view,
    setOpenOffers,
    topCollectionOffer,
    setViewUserItems,
    setItems,
    itemsRef,
    collection,
    searchInput,
    setSearchInput,
    filters,
    filterState,
    setFilterState,
    setLoadSearch,
    openNotify,
    setOpenNotify,
    errorMsg,
    actionType,
    setActionType,
  } = useContext(DataContext);
  const isMobile = useMediaQuery("(max-width: 770px)");
  const selectors = ["Listed", "Auction", "Activity"];
  const [openFilters, setOpenFilters] = useState(false);
  const debouncedValue = useDebounce(searchInput, 500);
  let filterRef = useRef(filters[0]);
  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      try {
        if (!menuRef.current.contains(e.target)) {
          setOpenFilters(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  async function search() {
    if (debouncedValue !== "" && view === 0) {
      setItems([]);
      let url = `${server}/api/mongo/${collection}/search?q=${debouncedValue}&inc=0`;
      const data = await FETCH(url);
      setLoadSearch(false);
      if (data !== "Error fetching") setItems(data);
    } else if (debouncedValue === "") setItems(itemsRef.current);
    else setItems([]);
  }
  useEffect(() => {
    search();
  }, [debouncedValue]);
  useEffect(() => {
    const openSearch = () => {
      if (searchInput !== "") {
        setLoadSearch(true);
      } else setLoadSearch(false);
    };
    openSearch();
  }, [searchInput]);
  async function sort() {
    setItems([]);
    let url = `${server}/api/mongo/${collection}/sort?q=${filterState}&inc=0`;
    const data = await FETCH(url);
    setLoadSearch(false);
    if (data !== "Error fetching") setItems(data);
    else setItems(itemsRef.current);
  }
  useEffect(() => {
    const openSort = () => {
      if (filterState === filters[0]) {
        setItems(itemsRef.current);
      } else if (filterState !== filterRef.current) {
        setLoadSearch(true);
        sort();
      }
      filterRef.current = filterState;
    };
    openSort();
  }, [filterState]);
  useTimeout(() => setOpenNotify(false), 5000, [openNotify]);
  function IS() {
    if (!active) {
      setActionType(ACTIONS.INACTIVE);
      setOpenNotify(true);
    } else {
      setViewUserItems(true);
    }
  }
  function CO() {
    if (!active) {
      setActionType(ACTIONS.INACTIVE);
      setOpenNotify(true);
    } else {
      setOpenOffers(true);
    }
  }
  return (
    <main className={styles.navbarContainer}>
      {openNotify && (
        <Notification
          action={{ type: actionType, payload: errorMsg }}
          close={setOpenNotify}
        />
      )}
      <aside className={styles.navbarSelectors}>
        {selectors.map((selector, i) => (
          <div
            className={view === i ? styles.active : styles.inActive}
            key={selector}
            onClick={() => setView(i)}
          >
            {selector}
          </div>
        ))}
      </aside>
      <aside className={styles.navbar}>
        <div
          className={styles.instantSell}
          style={{
            cursor: topCollectionOffer ? "pointer" : "not-allowed",
          }}
          onClick={topCollectionOffer ? IS : () => console.log("DeadSwitch")}
        >
          <RxLightningBolt />
          {isMobile ? null : <span>Instant sell</span>}
          {topCollectionOffer && topCollectionOffer.value ? (
            <div style={style}>
              <KCS width={15} height={16} />{" "}
              <span>{topCollectionOffer.value}</span>
            </div>
          ) : null}
        </div>
        <div className={styles.inputBarContainer}>
          <div className={styles.inputBar}>
            <input
              placeholder="Search by token id, name and attributes"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <AiOutlineSearch />
          </div>
        </div>
        <aside className={styles.filters}>
          <div
            className={styles.filterCurrent}
            onClick={() => setOpenFilters(true)}
          >
            {filterState} <MdOutlineKeyboardArrowDown />
          </div>
          <div className={styles.filter} ref={menuRef}>
            {" "}
            {openFilters
              ? filters.map((filter, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setFilterState(filters[i]);
                      setOpenFilters(false);
                    }}
                  >
                    {filter} {filterState === filters[i] ? <MdCheck /> : null}
                  </div>
                ))
              : null}
          </div>
        </aside>
      </aside>
      <aside className={styles.collectionOffer}>
        <div onClick={CO}>Make Collection Offer</div>
      </aside>
    </main>
  );
}
