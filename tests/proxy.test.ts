import { $Proxy } from "../src/proxy";

interface ITestLocale {
  root: {
    test: "$$RootTest";
    unknown: {
      unknownValue: "";
    };
    home: {
      title: "$$RootHomeTitle";
      subtitle: "$$RootHomeSubtitle";
    };
  };
  unknown: {
    unknownValue: "";
  };
}

const $testLocale = $Proxy<ITestLocale>({
  root: {
    test: "$$RootTest",
    home: { title: "$$RootHomeTitle", subtitle: "$$RootHomeSubtitle" },
  },
});

test("proxied testLocale property accessible", () => {
  expect($testLocale.root.home.title.toString()).toBe("$$RootHomeTitle");
  expect($testLocale.root.home.subtitle.toString()).toBe("$$RootHomeSubtitle");
});

test("accesing unknown property returns string instead of undefined", () => {
  expect($testLocale.unknown.toString()).toBe("unknown");
});

test("accessing unknown property of unknown property returns string instead of error", () => {
  expect($testLocale.unknown.unknownValue.toString()).toBe(
    "unknown.unknownValue",
  );
});

test("accessing unknown property of known property returns string of full access key", () => {
  expect($testLocale.root.unknown.toString()).toBe("root.unknown");
  expect($testLocale.root.unknown.unknownValue.toString()).toBe(
    "root.unknown.unknownValue",
  );
});
