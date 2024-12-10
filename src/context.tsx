import React, { createContext, useContext } from "react";
import { $Proxy } from "./proxy";
import { Provider } from "./types";

export type DeepNestObject<A extends object, B extends object> = {
  [AKey in Exclude<keyof A, keyof B>]: A[AKey];
} & {
  [BKey in Exclude<keyof B, keyof A>]: B[BKey];
} & {
  [Key in keyof A & keyof B]: A[Key] extends object
    ? B[Key] extends object
      ? DeepNestObject<A[Key], B[Key]>
      : never
    : B[Key] extends object
    ? never
    : A[Key] & B[Key];
};

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

export function createLocaleContext<T extends object>(): [
  () => T,
  Provider<T>
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
