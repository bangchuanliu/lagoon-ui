export const LANGUAGES = [
  { id: "en", name: "English" },
  { id: "zh-CN", name: "简体中文" },
  { id: "ja", name: "日本語" },
] as const;

export type Language = typeof LANGUAGES[number]["id"];
export type Values = Record<string, string | number>;
export type Messages = Partial<Record<Language, Readonly<Record<string, string>>>>;

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some(language => language.id === value);
}

export const commonMessages: Messages = {
  en: {
    "取消": "Cancel",
    "设置": "Settings",
    "通用": "General",
    "语言": "Language",
    "删除": "Delete",
    "添加": "Add",
    "移除": "Remove",
    "更改…": "Change…",
    "重试": "Retry",
    "继续": "Resume",
    "暂停": "Pause",
    "关闭": "Close",
    "保存": "Save",
    "全部": "All",
    "搜索": "Search",
    "配色": "Theme",
    "扫描中…": "Scanning…",
    "检查中…": "Checking…",
    "展开": "Expand",
    "收起": "Collapse",
    "名字": "Name",
    "后退": "Back",
  },
  ja: {
    "取消": "キャンセル",
    "设置": "設定",
    "通用": "一般",
    "语言": "言語",
    "删除": "削除",
    "添加": "追加",
    "移除": "取り除く",
    "更改…": "変更…",
    "重试": "再試行",
    "继续": "再開",
    "暂停": "一時停止",
    "关闭": "閉じる",
    "保存": "保存",
    "全部": "すべて",
    "搜索": "検索",
    "配色": "テーマ",
    "扫描中…": "スキャン中…",
    "检查中…": "確認中…",
    "展开": "展開",
    "收起": "折りたたむ",
    "名字": "名前",
    "后退": "戻る",
  },
};

export function translate(messages: Messages, language: Language, key: string, values: Values = {}): string {
  const lookup = (catalog: Readonly<Record<string, string>> | undefined) =>
    catalog && Object.prototype.hasOwnProperty.call(catalog, key) ? catalog[key] : undefined;
  const text = lookup(messages[language]) ?? lookup(commonMessages[language]) ?? key;
  return text.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : placeholder);
}

export function createLanguageStore(options: { defaultLanguage: Language; storageKey: string }) {
  const listeners = new Set<() => void>();
  const storage = () => typeof window === "undefined" ? undefined : window.localStorage;
  const read = (fallback = options.defaultLanguage): Language => {
    try {
      const saved = storage()?.getItem(options.storageKey);
      return isLanguage(saved) ? saved : options.defaultLanguage;
    } catch (error) {
      console.error("Could not read the language preference.", error);
      return fallback;
    }
  };
  let language = read();
  let unsaved = false;
  const update = (next: Language) => {
    if (language === next) return;
    language = next;
    for (const listener of listeners) listener();
  };
  const onStorage = (event: StorageEvent) => {
    if ((event.key === options.storageKey || event.key === null) &&
      (!event.storageArea || event.storageArea === storage())) {
      unsaved = false;
      update(read());
    }
  };
  return {
    getLanguage: () => language,
    setLanguage(next: Language) {
      if (!isLanguage(next)) throw new TypeError(`Unsupported language: ${String(next)}`);
      try {
        storage()?.setItem(options.storageKey, next);
        unsaved = false;
      } catch (error) {
        unsaved = true;
        console.error("Could not save the language preference.", error);
      }
      update(next);
    },
    subscribe(listener: () => void) {
      if (listeners.size === 0 && typeof window !== "undefined") {
        window.addEventListener("storage", onStorage);
        if (!unsaved) update(read(language));
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && typeof window !== "undefined") window.removeEventListener("storage", onStorage);
      };
    },
  };
}
