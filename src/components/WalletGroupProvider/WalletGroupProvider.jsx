import React, {useEffect, useMemo, useReducer, useState} from 'react';
import WalletGroupContext from './WalletGroupContext';
import {WalletGroup} from "../Modals/WalletSelector/WalletConfig";

const WalletGroupProvider = (props) => {
    const [group, dispatch] = useState(WalletGroup.EOA.name);

    const onGroupChange = (type) => {
        dispatch(type);
    };

    const contextWrapper = useMemo(
        () => ({
            group: group,
            dispatch: onGroupChange,
        }),
        [group],
    );

    useEffect(() => {
        console.debug(`WalletGroupContext =>`, group);
    }, [group]);

    return (
        <WalletGroupContext.Provider value={contextWrapper}>
            {props.children}
        </WalletGroupContext.Provider>
    );
};

export default WalletGroupProvider;
