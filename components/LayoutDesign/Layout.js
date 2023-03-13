import Navbar from "./Nav";
import Footer from "./Footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import RouteLoader from "../Notifications/RouteLoader";
import MobileSideBar from "./MobileSideBar";
import { AnimatePresence } from "framer-motion";
export default function Layout({ children }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const mobileMenuHandler = () => {
    setMobileMenu(!mobileMenu);
  };
  const router = useRouter();
  const [routeLoading, setRouteLoading] = useState(false);
  useEffect(() => {
    const route = () => {
      router.events.on("routeChangeStart", (url) => setRouteLoading(true));
      router.events.on("routeChangeComplete", (url) => setRouteLoading(false));
    };
    router.isReady && route();
  }, [router.isReady, router.events]);

  return (
    <>
      <div className="layout">
        <Navbar
          mobileMenu={mobileMenu}
          mobileMenuHandler={mobileMenuHandler}
          setOpenCart={setOpenCart}
        />
      </div>
      {children}
      <AnimatePresence>
        {mobileMenu && (
          <MobileSideBar
            mobileMenu={mobileMenu}
            setMobileMenu={setMobileMenu}
          />
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
}
