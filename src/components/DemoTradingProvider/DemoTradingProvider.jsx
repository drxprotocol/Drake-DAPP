import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import DemoTradingContext from './DemoTradingContext';
import {getLocalStorage, saveToLocalStorage} from "../../utils/LocalStorage";
import WebThreeContext from "../WebThreeProvider/WebThreeContext";
import {DefaultChain, DemoTradingChains} from "../../contract/ChainConfig";

const enableDemoTradingCacheKey = "ENABLE_DEMO_TRADING";

const DemoTradingProvider = (props) => {
    const web3Context = useContext(WebThreeContext);
    const chainId = web3Context.chainId || DefaultChain.chainId;

    const enableDemoTradingCache = getLocalStorage(enableDemoTradingCacheKey);
    const [enableDemoTrading, dispatch] = useState(enableDemoTradingCache || false);

    const onDemoTradingSwitch = (enable) => {
        dispatch(enable);
        saveToLocalStorage(enableDemoTradingCacheKey, enable);
    };

    const contextWrapper = useMemo(
        () => ({
            enable: enableDemoTrading,
            dispatch: onDemoTradingSwitch,
        }),
        [enableDemoTrading],
    );

    useEffect(() => {
        console.debug(`demoTradingContext =>`, enableDemoTrading);
    }, [enableDemoTrading]);

    useEffect(() => {
        console.debug(`current chainId =>`, chainId);
        onDemoTradingSwitch(DemoTradingChains.includes(chainId));
    }, [chainId]);

    return (
        <DemoTradingContext.Provider value={contextWrapper}>
            {props.children}
        </DemoTradingContext.Provider>
    );
};

export default DemoTradingProvider;
