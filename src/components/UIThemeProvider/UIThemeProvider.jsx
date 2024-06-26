import React, {useEffect, useMemo, useReducer, useState} from 'react';
import UIThemeContext from './UIThemeContext';
import {getLocalStorage, saveToLocalStorage} from "../../utils/LocalStorage";
import {UIThemeConfigs} from "./UIThemeConfig";
import {getQueryValue} from "../../utils/URLUtil";

const themeQueryKey = 'theme';
const themeCacheKey = "UI_THEME";

const buildCurrentTheme = () => {
    let themeInUrl = getQueryValue(themeQueryKey);
    if(themeInUrl){
        let theme = UIThemeConfigs.find(config => {
            return config.name === themeInUrl;
        });
        if(theme){
            saveToLocalStorage(themeCacheKey, theme);
            return theme;
        }
    }

    let themeCache = getLocalStorage(themeCacheKey);
    if(themeCache){
        return themeCache;
    }

    return UIThemeConfigs[0];
};

const UIThemeProvider = (props) => {
    const themeCache = buildCurrentTheme();
    const [theme, dispatch] = useState(themeCache);

    const onThemeChange = (themeConfig) => {
        dispatch(themeConfig);
        saveToLocalStorage(themeCacheKey, themeConfig);
    };

    const contextWrapper = useMemo(
        () => ({
            theme: theme,
            dispatch: onThemeChange,
        }),
        [theme],
    );

    useEffect(() => {
        console.debug(`theme =>`, theme);
        document.getElementsByTagName('body')[0].className = theme.themeClass;
    }, [theme]);

    return (
        <UIThemeContext.Provider value={contextWrapper}>
            {props.children}
        </UIThemeContext.Provider>
    );
};

export default UIThemeProvider;
