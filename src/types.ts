import type { ReactNode } from "react";

type MergeLocales<A, B> = {
  [key in keyof A & keyof B]: A[key] extends object
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

export type { MergeLocales, DeepPartial, Provider };
