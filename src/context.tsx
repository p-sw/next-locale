import React, { createContext, useContext } from "react";
import { $Proxy } from "./proxy";
import { Provider, DeepPartial, DeepNestObject, Locale } from "./types";

export function deeplyNestObject<A extends object, B extends object>(
  a: A,
  b: B
): DeepNestObject<A, B> {
  let newObj = {} as DeepNestObject<A, B>;
  const duplicatedKeys = new Set<keyof A | keyof B>();
  for (const key of Object.keys(a) as (keyof A)[]) {
    if (key in b) duplicatedKeys.add(key);
    else (newObj as A)[key] = a[key];
  }
  for (const key of Object.keys(b) as (keyof B)[]) {
    if (key in a) duplicatedKeys.add(key);
    else (newObj as B)[key] = b[key];
  }
  for (const key of Array.from(duplicatedKeys)) {
    if (typeof a[key as keyof A] === typeof b[key as keyof B]) {
      if (typeof a[key as keyof A] === "object") {
        (newObj as A)[key as keyof A] = deeplyNestObject(
          a[key as keyof A] as object,
          b[key as keyof B] as object
        ) as A[keyof A];
      }
      if (typeof a[key as keyof A] === "string") {
        (newObj as A)[key as keyof A] = a[key as keyof A];
      }
    }
    // omit on type conflict like
    // object & string | string & object
  }
  return newObj;
}

export function createLocaleContext(): [() => Locale, Provider<Locale>] {
  const context = createContext<DeepPartial<Locale>>({});

  function useLocale() {
    return $Proxy<Locale>(useContext(context));
  }

  const Provider: Provider<Locale> = ({ value, children }) => {
    const existingLocale = useContext(context);

    return (
      <context.Provider value={deeplyNestObject(existingLocale, value)}>
        {children}
      </context.Provider>
    );
  };

  return [useLocale, Provider];
}
