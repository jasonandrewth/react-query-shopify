import { useCallback, useEffect, useRef, useState } from "react";

/*  ------------------------------ */
/*  Client helpers
/*  ------------------------------ */

export const Keys = {
  ENTER: 13,
  SPACE: 32,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
};

export const isBrowser = typeof window !== "undefined";

export function isMobileSafari() {
  if (!isBrowser) return;

  return navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)
    ? true
    : false;
}

export function useWindowSize() {
  function getSize() {
    return {
      width: isBrowser ? window.innerWidth : 0,
      height: isBrowser ? window.innerHeight : 0,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isBrowser) return;

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}
