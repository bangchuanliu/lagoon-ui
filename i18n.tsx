import { useSyncExternalStore } from "react";
import { createLanguageStore, LANGUAGES, translate, type Language, type Messages, type Values } from "./language";

export { LANGUAGES, isLanguage, type Language, type Messages, type Values } from "./language";

export function createI18n(options: {
  defaultLanguage: Language;
  storageKey: string;
  messages: Messages;
}) {
  const store = createLanguageStore(options);
  const t = (key: string, values?: Values) => translate(options.messages, store.getLanguage(), key, values);
  return {
    ...store,
    t,
    useI18n() {
      const language = useSyncExternalStore(store.subscribe, store.getLanguage, () => options.defaultLanguage);
      return { language, setLanguage: store.setLanguage, t };
    },
  };
}

export function LanguageSelect({ language, onChange, id }: {
  language: Language;
  onChange: (language: Language) => void;
  id?: string;
}) {
  return (
    <select id={id} value={language} onChange={event => {
      const next = LANGUAGES.find(option => option.id === event.target.value);
      if (next) onChange(next.id);
    }}>
      {LANGUAGES.map(option => <option key={option.id} value={option.id} lang={option.id}>{option.name}</option>)}
    </select>
  );
}
