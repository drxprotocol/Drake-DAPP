import React, {useEffect, useMemo, useReducer, useState} from 'react';
import PortfolioTypeContext from './PortfolioTypeContext';
import {PORTFOLIO_TYPE} from "../TradingConstant";
import {getLocalStorage, saveToLocalStorage} from "../../utils/LocalStorage";

const portfolioTypeCacheKey = "currentPortfolioType";

const PortfolioTypeProvider = (props) => {
    const portfolioTypeCache = getLocalStorage(portfolioTypeCacheKey);
    const [portfolioType, dispatch] = useState(portfolioTypeCache || PORTFOLIO_TYPE.Isolated);

    const onPortfolioTypeChange = (type) => {
        dispatch(type);
        saveToLocalStorage(portfolioTypeCacheKey, type);
    };

    const contextWrapper = useMemo(
        () => ({
            type: portfolioType,
            dispatch: onPortfolioTypeChange,
        }),
        [portfolioType],
    );

    useEffect(() => {
        console.debug(`portfolioTypeContext =>`, portfolioType);
    }, [portfolioType]);

    return (
        <PortfolioTypeContext.Provider value={contextWrapper}>
            {props.children}
        </PortfolioTypeContext.Provider>
    );
};

export default PortfolioTypeProvider;
