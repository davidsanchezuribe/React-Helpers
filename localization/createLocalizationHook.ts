import { useMemo } from "react";

type LocalizationMessages = {
  [key: string]: string | LocalizationMessages;
};

const createLocalizationHook = <
  T extends LocalizationMessages,
  U extends string,
>(
  moduleMessages: Record<string, T>,
  languageFallback: U,
) => {
  const useLocalization = (lang: string, customMessages?: T) => {
    const messages = useMemo(
      (): T =>
        customMessages
          ? customMessages
          : lang in moduleMessages
            ? moduleMessages[lang]
            : moduleMessages[languageFallback],
      [customMessages, lang],
    );
    return messages;
  };
  return useLocalization;
};

export default createLocalizationHook;
