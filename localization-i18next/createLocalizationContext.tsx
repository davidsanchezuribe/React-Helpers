import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

type LocalizationMessages = {
  [key: string]: string | LocalizationMessages;
};

type LocalizationContextType<T extends LocalizationMessages> = {
  messages: T;
  lang: string;
};

type LocalizationProviderProps<T> = {
  lang?: string;
  customMessages?: T;
  children: ReactNode;
  geti18next?: boolean;
};

const createLocalizationContext = <T extends LocalizationMessages>(
  moduleMessages: Record<string, T>,
  languageFallback: string,
) => {
  if (!(languageFallback in moduleMessages)) {
    console.warn(
      `createLocalizationHook: languageFallback "${languageFallback}" must be in moduleMessages as a property`,
    );
  }
  const LocalizationContext = createContext<LocalizationContextType<T> | null>(
    null,
  );
  const LocalizationProvider = (props: LocalizationProviderProps<T>) => {
    const { lang: langArg, customMessages, geti18next, children } = props;
    const { i18n } = useTranslation()
    const isI18nAvailable = Boolean(i18n && i18n.isInitialized);
    if (geti18next && !isI18nAvailable) {
      console.warn(
        "geti18next is 'true' in LocalizationProvider but i18next is not defined or has not been initialized"
      );
    }
    const useI18nSource = geti18next && isI18nAvailable;
    const lang = useI18nSource ? i18n.language : langArg ? langArg : Object.keys(moduleMessages)[0]

    const value = useMemo(
      (): { messages: T; lang: string } => ({
        messages: customMessages
          ? customMessages
          : lang in moduleMessages
            ? moduleMessages[lang]
            : moduleMessages[languageFallback],
        lang,
      }),
      [customMessages, lang],
    );

    return (
      <LocalizationContext.Provider value={value}>
        {children}
      </LocalizationContext.Provider>
    );
  };
  const useLocalizationContext = (): LocalizationContextType<T> => {
    const context = useContext(LocalizationContext);
    if (!context) {
      throw new Error(
        "useLocalizationContext debe ser utilizado dentro de un LocalizationProvider",
      );
    }
    return context;
  };
  return { LocalizationProvider, useLocalizationContext };
};

export default createLocalizationContext;
