import React, {useEffect, useMemo, useReducer, useState} from 'react';
import InstrumentContext from './InstrumentContext';
import {DEFAULT_INSTRUMENT_CODE, ENABLE_INSTRUMENTS} from "../TradingConstant";
import {getQueryValue} from "../../utils/URLUtil";

const InstrumentProvider = (props) => {
    const _instrumentCode = useMemo(() => {
        let code = getQueryValue('instrumentCode') || DEFAULT_INSTRUMENT_CODE;
        code = ENABLE_INSTRUMENTS.includes(code) ? code : DEFAULT_INSTRUMENT_CODE;
        return code;
    }, []);

    const [instrumentCode, dispatch] = useState(_instrumentCode);

    const onPortfolioTypeChange = (code) => {
        dispatch(code);
    };

    const contextWrapper = useMemo(
        () => ({
            code: instrumentCode,
            dispatch: onPortfolioTypeChange,
        }),
        [instrumentCode],
    );

    useEffect(() => {
        console.debug(`instrumentContext =>`, instrumentCode);
    }, [instrumentCode]);

    return (
        <InstrumentContext.Provider value={contextWrapper}>
            {props.children}
        </InstrumentContext.Provider>
    );
};

export default InstrumentProvider;
