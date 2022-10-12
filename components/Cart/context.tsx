import React, { FC, useState, useMemo, PropsWithChildren } from "react";
import nookies, { parseCookies, setCookie, destroyCookie } from "nookies";

export interface State {
  quantity: number;
}

const initialState = {
  quantity: 0,
};

export const cartContext = React.createContext<State | any>(initialState);

export const CartProvider: React.FC = (props) => {
  const cookies = parseCookies();

  const [tier, setTier] = useState<number>(
    parseInt(cookies?.CHECKOUT_ID, 10) || 1
  );
  const router = useRouter();

  const handleTier = (newTier: number) => {
    if (tier == newTier) {
      setTier((prevState) => prevState + 1);
    }
  };

  const lowerTier = (newTier: number) => {
    if (tier == newTier) {
      setTier((prevState) => prevState + 1);
      // console.log(currentTier)
    }
    // localStorage.setItem<any>('Tier', tier)
  };

  const value: IGlobalContext = useMemo(
    () => ({
      tier,
      handleTier,
    }),
    [tier]
  );

  useEffect(() => {
    const checkoutId = nookies.get(null, CHECKOUT_ID).CHECKOUT_ID;
    setCookie(null, "currentTier", JSON.stringify(tier), {
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return () => {
      console.log("context cleaned");
    };
  }, [tier]);

  return (
    <TierContext.Provider value={value}>{props.children}</TierContext.Provider>
  );
};

export function useTier() {
  return useContext(TierContext);
}

cartContext.displayName = "CartContext";
