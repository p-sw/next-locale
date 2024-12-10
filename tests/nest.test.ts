import { deeplyNestObject } from "../src/context";
import { type DeepNestObject } from "../src/types";

const testA = {
  a: {
    b: "1",
    c: "2",
    d: {
      e: "3",
      f: "4",
    },
  },
  g: {
    h: "5",
  },
  i: "6",
  j: "7",
};

const testB = {
  a: {
    c: {
      a: "9",
    },
    g: "8",
  },
  b: {
    a: "10",
  },
  g: "11",
};
type Prettify<T> = {
  [K in keyof T]: Prettify<T[K]>;
} & {};
type Test = DeepNestObject<typeof testA, typeof testB>;
type TestPretty = Prettify<Test>;

const nested = deeplyNestObject(testA, testB);

test("each unique keys should be added normally", () => {
  expect(nested.b).toStrictEqual({ a: "10" });
  expect(nested.i).toEqual("6");
  expect(nested.j).toEqual("7");
});

test("duplicated keys should be merged deeply", () => {
  expect(nested.a.b).toEqual("1");
  expect(nested.a.d).toStrictEqual({ e: "3", f: "4" });
  expect(nested.a.g).toEqual("8");
});

test("conflicted keys should be excluded from object", () => {
  expect(nested).not.toHaveProperty("a.c");
  expect(nested).not.toHaveProperty("g");
});
