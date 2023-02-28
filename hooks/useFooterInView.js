import { useState, useEffect } from "react";

export default function useFooterInView() {
  const [isFooterInView, setIsFooterInView] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const footer = document.getElementById("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        setIsFooterInView(footerRect.top <= window.innerHeight);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isFooterInView;
}
