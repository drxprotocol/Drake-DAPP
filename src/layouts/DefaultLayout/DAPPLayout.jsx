import React, {useState, useMemo, useEffect, useContext} from 'react';

import '../../assets/css/tailwind.css';
import '@rainbow-me/rainbowkit/styles.css'

import './index.scss';
import './theme_light.scss';
import '../../components/Icons/index.scss';
import '../../components/Coin/index.scss';
import '../../components/DAPPForm/index.scss';
import {I18nProvider, initializeDefaultLanguage} from "../../components/i18n";
import WalletGroupProvider from "../../components/WalletGroupProvider/WalletGroupProvider";
import WalletGroupContext from "../../components/WalletGroupProvider/WalletGroupContext";
import {WalletGroup} from "../../components/Modals/WalletSelector/WalletConfig";
import UIThemeProvider from "../../components/UIThemeProvider/UIThemeProvider";
import {FamiliarWalletsDAPPLayout} from "./components/WalletsLayout/FamiliarWalletsDAPPLayout";
// import {SocialWalletsDAPPLayout} from "./components/WalletsLayout/SocialWalletsDAPPLayout";





const WalletsDAPPLayout = ({ MainContentComponent, layout }) => {

    // return <SocialWalletsDAPPLayout MainContentComponent={MainContentComponent} layout={layout}/>;
    return <FamiliarWalletsDAPPLayout MainContentComponent={MainContentComponent} layout={layout}/>;
};

export const DAPPLayout = ({ MainContentComponent, layout }) => {
    return (
        <WalletGroupProvider>
            <UIThemeProvider>
                <I18nProvider>
                    <WalletsDAPPLayout MainContentComponent={MainContentComponent} layout={layout} />
                </I18nProvider>
            </UIThemeProvider>
        </WalletGroupProvider>
    );
};

