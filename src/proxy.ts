const isProxied = Symbol("$isProxied");
const Pure = Symbol("$Pure");

function undefinedChain(key: string) {
  return new Proxy(new String(key), {
    get(target: any, p: string | symbol) {
      if (typeof target[p] === "undefined") {
        return undefinedChain(`${target.toString()}.${p.toString()}`);
      }

      return typeof target[p] === "function"
        ? target[p].bind(target.toString())
        : target[p];
    },
  });
}

function applyProxy(obj: object, prepath: string = "") {
  if ((obj as { [isProxied]: true | undefined })[isProxied]) return obj; // preventing double proxy

  return new Proxy(obj, {
    get(target: any, p: string | symbol) {
      if (p === isProxied) return true;
      if (p === Pure) return target;

      if (typeof target[p] === "undefined") {
        return undefinedChain(
          prepath.length > 0 ? `${prepath}.${p.toString()}` : p.toString(),
        );
      }
      return target[p];
    },
  });
}

function $Proxy<T extends object | string>(
  locale: object | string,
  prepath: string = "",
): T {
  if (typeof locale === "string") return locale as T;

  let v: { [key: string]: object | string } = {};

  for (const [key, value] of Object.entries(locale) as [
    string,
    object | string,
  ][]) {
    if (typeof value === "object") {
      v[key] = $Proxy(value, prepath.length > 0 ? `${prepath}.${key}` : key);
    } else {
      v[key] = value;
    }
  }

  return applyProxy(v, prepath) as T;
}

/**
 * Because Proxy is unserializable, sending proxy Server Component -> Client Component will cause warning form nextjs.
 * proxied[Pure] will give pure object that is serializable, without Proxy applied.
 *
 * @param proxiedLocale
 */
function $Pure<T extends object>(proxiedLocale: T): T {
  if (!(proxiedLocale as { [isProxied]: true | undefined })[isProxied])
    return proxiedLocale;

  return (proxiedLocale as { [Pure]: T })[Pure];
}

export { $Proxy, $Pure, Pure, isProxied };
