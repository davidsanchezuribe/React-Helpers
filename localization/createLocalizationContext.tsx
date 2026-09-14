import React, { createContext, ReactNode, useContext, useMemo } from "react";

type LocalizationMessages = {
  [key: string]: string | LocalizationMessages;
};

type LocalizationContextType<T extends LocalizationMessages> = {
  messages: T;
  lang: string;
};

const createLocalizationContext = <
  T extends LocalizationMessages,
  U extends string,
>(
  moduleMessages: Record<U, T> & Record<string, T>,
  languageFallback: U,
) => {
  const LocalizationContext = createContext<LocalizationContextType<T> | null>(
    null,
  );
  const LocalizationProvider = ({
    lang,
    customMessages,
    children,
  }: {
    lang: string;
    customMessages?: T;
    children: ReactNode;
  }) => {
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
