import assert from "node:assert/strict";
import { test } from "node:test";
import { commonMessages, createLanguageStore, translate } from "./language.ts";

test("translations use app messages, common labels, and source-language fallbacks", () => {
  const messages = { en: { "电影": "Movies", "取消": "Never mind" } };
  assert.equal(translate(messages, "en", "电影"), "Movies");
  assert.equal(translate(messages, "en", "设置"), "Settings");
  assert.equal(translate(messages, "en", "取消"), "Never mind");
  assert.equal(translate(messages, "zh-CN", "电影"), "电影");
  assert.equal(translate(messages, "en", "My personal tag"), "My personal tag");
  assert.equal(translate(messages, "en", "constructor"), "constructor");
  assert.equal(translate(messages, "en", "__proto__"), "__proto__");
});

test("named values preserve zero, literal replacement characters, and unknown placeholders", () => {
  const messages = { en: { "{name}：{count} 部 {unknown}": "{name}: {count} movies {unknown}" } };
  assert.equal(translate(messages, "en", "{name}：{count} 部 {unknown}", { name: "$&", count: 0 }),
    "$&: 0 movies {unknown}");
  assert.equal(translate({}, "zh-CN", "{count} 部", { count: 2 }), "2 部");
  assert.equal(translate({}, "en", "{en} {year}"), "{en} {year}");
  assert.equal(translate({}, "en", "{toString}"), "{toString}");
});

test("Japanese supports common labels, app overrides, interpolation, and source fallbacks", () => {
  const messages = { ja: { "共 {count} 项": "{count} 件", "取消": "やめる" } };
  assert.equal(translate(messages, "ja", "设置"), "設定");
  assert.equal(translate(messages, "ja", "取消"), "やめる");
  assert.equal(translate(messages, "ja", "共 {count} 项", { count: 0 }), "0 件");
  assert.equal(translate(messages, "ja", "缺少 {count} 项", { count: 2 }), "缺少 2 项");
  for (const key of Object.keys(commonMessages.en ?? {})) {
    assert.ok(Object.prototype.hasOwnProperty.call(commonMessages.ja, key), `Missing Japanese label: ${key}`);
  }
});

test("language preference persists, notifies once, and syncs across windows", t => {
  const data = new Map<string, string>();
  const events = new EventTarget();
  const localStorage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); },
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage,
      addEventListener: events.addEventListener.bind(events),
      removeEventListener: events.removeEventListener.bind(events),
    },
  });
  t.after(() => { Reflect.deleteProperty(globalThis, "window"); });
  const store = createLanguageStore({ defaultLanguage: "zh-CN", storageKey: "cine:language" });
  assert.equal(store.getLanguage(), "zh-CN");
  assert.throws(() => Reflect.apply(store.setLanguage, null, ["fr"]), /Unsupported language/);
  let notifications = 0;
  const unsubscribe = store.subscribe(() => notifications++);
  store.setLanguage("en");
  store.setLanguage("en");
  assert.equal(data.get("cine:language"), "en");
  assert.equal(store.getLanguage(), "en");
  assert.equal(notifications, 1);
  assert.equal(createLanguageStore({ defaultLanguage: "zh-CN", storageKey: "cine:language" }).getLanguage(), "en");
  store.setLanguage("ja");
  assert.equal(data.get("cine:language"), "ja");
  assert.equal(store.getLanguage(), "ja");
  assert.equal(createLanguageStore({ defaultLanguage: "zh-CN", storageKey: "cine:language" }).getLanguage(), "ja");
  const send = (key: string | null) => {
    const event = new Event("storage");
    Object.assign(event, { key, storageArea: localStorage });
    events.dispatchEvent(event);
  };
  data.set("cine:language", "zh-CN");
  send("other:language");
  assert.equal(store.getLanguage(), "ja");
  send("cine:language");
  assert.equal(store.getLanguage(), "zh-CN");
  data.set("cine:language", "ja");
  send("cine:language");
  assert.equal(store.getLanguage(), "ja");
  data.set("cine:language", "unsupported");
  send("cine:language");
  assert.equal(store.getLanguage(), "zh-CN");
  store.setLanguage("en");
  data.clear();
  send(null);
  assert.equal(store.getLanguage(), "zh-CN");
  unsubscribe();
  data.set("cine:language", "en");
  send("cine:language");
  assert.equal(store.getLanguage(), "zh-CN");
  const resubscribe = store.subscribe(() => {});
  assert.equal(store.getLanguage(), "en");
  resubscribe();
});

test("unavailable storage is reported and language switching still works in memory", t => {
  const errors: unknown[][] = [];
  t.mock.method(console, "error", (...args: unknown[]) => { errors.push(args); });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { get localStorage() { throw new Error("Storage blocked"); } },
  });
  t.after(() => { Reflect.deleteProperty(globalThis, "window"); });
  const store = createLanguageStore({ defaultLanguage: "zh-CN", storageKey: "language" });
  store.setLanguage("en");
  assert.equal(store.getLanguage(), "en");
  assert.equal(errors.length, 2);
});

test("a failed save does not reset the chosen language when a component subscribes", t => {
  const events = new EventTarget();
  t.mock.method(console, "error", () => {});
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: () => null,
        setItem: () => { throw new Error("Quota exceeded"); },
      },
      addEventListener: events.addEventListener.bind(events),
      removeEventListener: events.removeEventListener.bind(events),
    },
  });
  t.after(() => { Reflect.deleteProperty(globalThis, "window"); });
  const store = createLanguageStore({ defaultLanguage: "zh-CN", storageKey: "language" });
  store.setLanguage("en");
  const unsubscribe = store.subscribe(() => {});
  assert.equal(store.getLanguage(), "en");
  unsubscribe();
});
