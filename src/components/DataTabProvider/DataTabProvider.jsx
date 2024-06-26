import React, {useEffect, useMemo, useState} from 'react';
import DataTabContext from './DataTabContext';
import {DataTabEnum} from "./DataTabEnum";
import {getQueryValue, updateQueryStringParameterToCurrentURL} from "../../utils/URLUtil";

const DataTabProvider = (props) => {
    const [dataTab, dispatch] = useState(null);

    const onDataTabChange = (tab) => {
        dispatch(tab);
    };

    const contextWrapper = useMemo(
        () => ({
            dataTab: dataTab,
            dispatch: onDataTabChange,
        }),
        [dataTab],
    );

    useEffect(() => {
        if(dataTab){
            console.debug(`DataTabContext =>`, dataTab);
            updateQueryStringParameterToCurrentURL('dataTab', dataTab);
        }
    }, [dataTab]);
    useEffect(() => {
        let dataTabQueryValue = getQueryValue('dataTab') || DataTabEnum.Orders;
        if(!dataTab){
            onDataTabChange(dataTabQueryValue);
        }
    }, []);

    return (
        <DataTabContext.Provider value={contextWrapper}>
            {props.children}
        </DataTabContext.Provider>
    );
};

export default DataTabProvider;
