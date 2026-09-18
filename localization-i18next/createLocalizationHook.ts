import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type LocalizationMessages = {
  [key: string]: string | LocalizationMessages;
};

const createLocalizationHook = <T extends LocalizationMessages>(
  moduleMessages: { [key: string]: T },
  languageFallback: string,
) => {
  if (!(languageFallback in moduleMessages)) {
    console.warn(
      `createLocalizationHook: languageFallback "${languageFallback}" must be in moduleMessages as a property`,
    );
  }
  const useLocalization = (options: {
    lang?: string,
    customMessages?: T,
    geti18next?: boolean
  }) => {
    const { lang: langArg, customMessages, geti18next } = options
    const { i18n } = useTranslation();
    const isI18nAvailable = Boolean(i18n && i18n.isInitialized);
    if (geti18next && !isI18nAvailable) {
      console.warn(
        "geti18next is 'true' in createLocalizationHook but i18next is not defined or has not been initialized"
      );
    }
    const useI18nSource = geti18next && isI18nAvailable;
    const lang = useI18nSource ? i18n.language : langArg ? langArg : Object.keys(moduleMessages)[0]

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
