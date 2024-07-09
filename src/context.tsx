import React, { createContext, useContext } from "react";
import { $Proxy } from "./proxy";
import { Provider } from "./types";

export function createLocaleContext<T extends object>(): [
  () => T,
  Provider<T>,
] {
  const context = createContext<T>({} as T);

  function useLocale() {
    return $Proxy<T>(useContext(context));
  }

  const Provider: Provider<T> = ({ value, children }) => {
    const existingLocale = useContext(context);

    return (
      <context.Provider value={{ ...existingLocale, ...value }}>
        {children}
      </context.Provider>
    );
  };

  return [useLocale, Provider];
}
