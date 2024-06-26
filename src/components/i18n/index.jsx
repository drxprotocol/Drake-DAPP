import enUS from "../../locales/en_US";
import zhCN from "../../locales/zh_CN";
import intl from "react-intl-universal";
import {getQueryValue} from "../../utils/URLUtil";
import {getLocalStorage, saveToLocalStorage} from "../../utils/LocalStorage";
import {useEffect, useMemo, useState} from "react";
import React from "react";
import I18nContext from './I18nContext';
import ApplicationConfig from "../../ApplicationConfig";

const languageKey = 'lang';
const defaultLanguage = 'en-US';

export const languageList = [
    {
        label: "English",
        value: "en-US",
        icon: 's_l_icon_en',
    },
    {
        label: "한국어",
        value: "en-US", // todo: need to update this value
        icon: 's_l_icon_korean',
    },
    {
        label: "简体中文",
        value: "zh-CN",
        icon: 's_l_icon_cn',
    },
];

export const LOCALE_DATA = {
    "en-US": enUS,
    "zh-CN": zhCN,
};

const buildCurrentLanguage = () => {
    if(ApplicationConfig.comingSoon){
        return defaultLanguage;
    }

    let langInUrl = getQueryValue(languageKey);
    if(langInUrl && languageList.some(item => item.value === langInUrl)){
        return langInUrl;
    }

    let currentLocale = intl.determineLocale({
        urlLocaleKey: languageKey, // Example: https://fe-tool.com/react-intl-universal?lang=en-US
        localStorageLocaleKey: languageKey, // Example: "lang=en-US" in cookie
    });

    let langInCache = getLocalStorage(languageKey);
    if(!langInCache){
        langInCache = currentLocale;
    }

    if(langInCache && languageList.some(item => item.value === langInCache)){
        return langInCache;
    }

    return defaultLanguage;
};

export const getCurrentLanguageConfig = () => {
    let currentLanguage = buildCurrentLanguage();
    return languageList.filter((language) => {
        return language.value === currentLanguage;
    })[0];
};

export const initializeDefaultLanguage = () => {
    let currentLanguage = buildCurrentLanguage();
    initializeLanguage(currentLanguage);
};

export const initializeLanguage = (currentLanguage) => {
    console.debug(`currentLanguage =>`, currentLanguage);

    return new Promise((resolve, reject) => {
        intl.init({
            currentLocale: currentLanguage,
            locales: LOCALE_DATA,
        }).then(() => {
            saveToLocalStorage(languageKey, currentLanguage);
            resolve();
        });
    });
};

export const I18nProvider = (props) => {
    const defaultLang = buildCurrentLanguage();
    const [lang, dispatch] = useState(defaultLang);
    const [i18nInited, setI18nInited] = React.useState(false);

    const contextWrapper = useMemo(
        () => ({
            lang: lang,
            dispatch: dispatch,
        }),
        [lang],
    );

    useEffect(() => {
        console.debug(`current lang: lang => `, lang);
        initializeLanguage(lang).then(() => {
            setI18nInited(true);
        });
    }, [lang]);

    return <I18nContext.Provider value={contextWrapper}>{i18nInited && props.children}</I18nContext.Provider>;
};

export const useIntl = () => {
   return intl;
};