import type { ReactNode } from "react";

type MergeLocales<A, B> = {
  [key in keyof A & keyof B]: A[key] extends Record<string, string | object>
    ? MergeLocales<A[key], B[key]>
    : A[key];
};

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type Provider<T> = (props: {
  value: DeepPartial<T>;
  children: ReactNode;
}) => ReactNode;

type DeepNestObject<A extends object, B extends object> = {
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

interface Locale {
  // declare module '@p-sw/next-locale' {
  //   interface Locale {} // override
  // }
}

export type { MergeLocales, DeepPartial, Provider, DeepNestObject, Locale };
