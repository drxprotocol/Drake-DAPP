import React, {useState, useMemo, useEffect, useContext} from 'react';

import { getLocalStorage, saveToLocalStorage } from '../../../../utils/LocalStorage';
import WalletGroupContext from "../../../../components/WalletGroupProvider/WalletGroupContext";
import {WalletGroup} from "../../../../components/Modals/WalletSelector/WalletConfig";

export const WalletConnectorDisclaimer = () => {
    const walletGroupContext = useContext(WalletGroupContext);
    useEffect(() => {
        console.debug(`walletGroupContext =>`, walletGroupContext);
    }, [walletGroupContext]);

    const recentGroupCacheKey = 'RECENT_WALLET_GROUP';
    const [recentGroup, setRecentGroup] = useState('');
    useEffect(() => {
        let _recentGroup = getLocalStorage(recentGroupCacheKey) || WalletGroup.EOA.name;
        if(_recentGroup){
            setRecentGroup(_recentGroup);
        }
    }, []);
    useEffect(() => {
        if(recentGroup){
            walletGroupContext.dispatch(recentGroup);

            saveToLocalStorage(recentGroupCacheKey, recentGroup);
        }
    }, [recentGroup]);

    const switchGroup = () => {
        let groupName = walletGroupContext?.group === WalletGroup.EOA.name ? WalletGroup.AA.name : WalletGroup.EOA.name;
        setRecentGroup(groupName);
    };

    return (
        <div className={'overlay_container'}>
            <div className={'f_r_r'}>
                <div className={'c_link cp'} onClick={switchGroup}>{`Connect with ${walletGroupContext?.group === WalletGroup.Familiar.name ? WalletGroup.Familiar.alias : WalletGroup.Social.alias}`}</div>
            </div>
        </div>
    );
};

export const darkWalletThemeConfig = {
    radii: {
        actionButton: "4px",
        modal: "12px",
        modalMobile: "12px"
    },
    colors: {
        modalBackdrop: 'rgba(2,6,23,0.89)',
        modalBackground: '#0f172a',
        modalBorder:'#1e293b',
        modalText: '#ffffff',
    },
};

export const lightWalletThemeConfig = {
    radii: {
        actionButton: "4px",
        modal: "12px",
        modalMobile: "12px"
    },
    colors: {
        modalBackdrop: 'rgba(248,250,252,0.89)',
        modalBackground: '#f1f5f9',
        modalBorder:'#e2e8f0',
        modalText: '#010207',
    },
};



