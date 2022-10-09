import React, { FC, useCallback, useMemo, PropsWithChildren } from "react";

export interface State {
  displayMenu: boolean;
  displayNewsletter: boolean;
  menuView: string;
}

const initialState = {
  displayMenu: false,
  displayNewsletter: false,
  menuView: "MENU_VIEW",
};

type Action =
  | {
      type: "OPEN_MENU";
    }
  | {
      type: "CLOSE_MENU";
    }
  | {
      type: "OPEN_NEWSLETTER";
    }
  | {
      type: "CLOSE_NEWSLETTER";
    };

export const UIContext = React.createContext<State | any>(initialState);

UIContext.displayName = "UIContext";

function uiReducer(state: State, action: Action) {
  switch (action.type) {
    case "OPEN_MENU": {
      return {
        ...state,
        displayMenu: true,
      };
    }
    case "CLOSE_MENU": {
      return {
        ...state,
        displayMenu: false,
      };
    }
    case "OPEN_NEWSLETTER": {
      return {
        ...state,
        displayNewsletter: true,
      };
    }
    case "CLOSE_NEWSLETTER": {
      return {
        ...state,
        displayNewsletter: false,
      };
    }
  }
}

export const UIProvider: FC<PropsWithChildren> = (props) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);

  const openMenu = useCallback<() => void>(
    () => dispatch({ type: "OPEN_MENU" }),
    [dispatch]
  );
  const closeMenu = useCallback<() => void>(
    () => dispatch({ type: "CLOSE_MENU" }),
    [dispatch]
  );
  const toggleMenu = useCallback(() => {
    state.displayMenu
      ? dispatch({ type: "CLOSE_MENU" })
      : dispatch({ type: "OPEN_MENU" });
  }, [dispatch, state.displayMenu]);

  const openNewsletter = useCallback<() => void>(
    () => dispatch({ type: "OPEN_NEWSLETTER" }),
    [dispatch]
  );
  const closeNewsletter = useCallback<() => void>(
    () => dispatch({ type: "CLOSE_NEWSLETTER" }),
    [dispatch]
  );

  const value = useMemo(
    () => ({
      ...state,
      openNewsletter,
      closeNewsletter,
      openMenu,
      closeMenu,
      toggleMenu,
    }),
    [state]
  );

  return <UIContext.Provider value={value} {...props} />;
};

export const useUI = () => {
  const context = React.useContext(UIContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`);
  }
  return context;
};

export const ManagedUIContext: FC<PropsWithChildren> = ({ children }) => (
  <UIProvider>{children}</UIProvider>
);
