import React, {useState, useMemo, useEffect, useContext} from 'react';
import Header from '../Header/index';
import Footer from '../Footer/index';

import {
    WagmiConfig as WagmiConfigV1,
    configureChains as configureChainsV1,
    createConfig as createClientV1,
} from "wagmi1";
import { arbitrumGoerli, arbitrum } from 'wagmi1/chains'
import {publicProvider as publicProviderV1} from 'wagmi1/providers/public'

import {
    connectorsForWallets as connectorsForWalletsV1,
    RainbowKitProvider as RainbowKitProviderV1,
    darkTheme as darkThemeV1
} from '@rainbow-me/rainbowkit1'
import {
    facebookWallet,
    githubWallet,
    discordWallet,
    enhanceWalletWithAAConnector,
} from '@zerodev/wagmi/rainbowkit'

import { Mainnet, Arbitrum, DAppProvider, DEFAULT_SUPPORTED_CHAINS, MetamaskConnector } from '@usedapp/core';
import WebThreeProvider from '../../../../components/WebThreeProvider/WebThreeProvider';
import { cacheDefaultTokens } from '../../../../contract/TokenContract';
import PageInfoProvider from '../../../../components/PageInfoProvider/PageInfoProvider';
import TransactionContextProvider from '../../../../components/Transaction/TransactionContextProvider';
import {
    ArbitrumForkChain,
    ArbitrumForkServerChain,
    ArbitrumGoerliChain,
    ArbitrumGoerliForkChain,
    ArbitrumHardhatForkChain,
    ArbitrumHardhatForkServerChain,
    ArbitrumSepoliaChain,
    ArbitrumSepoliaForkChain,
    buildSupportedWagmiChains, convertToWagmiChain,
    DefaultChain, SupportedCustomChains, SupportedExtraChains
} from '../../../../contract/ChainConfig';
import { getQueryValue } from '../../../../utils/URLUtil';
import ApplicationConfig from '../../../../ApplicationConfig';
import { getLocalStorage, saveToLocalStorage } from '../../../../utils/LocalStorage';
import {I18nProvider, initializeDefaultLanguage} from "../../../../components/i18n";
import PortfolioTypeProvider from "../../../../components/PortfolioTypeProvider/PortfolioTypeProvider";
import DemoTradingProvider from "../../../../components/DemoTradingProvider/DemoTradingProvider";
import InstrumentProvider from "../../../../components/InstrumentProvider/InstrumentProvider";
import {twitterWallet, googleWallet} from "../../../../components/WalletConnectors";
import WalletGroupProvider from "../../../../components/WalletGroupProvider/WalletGroupProvider";
import WalletGroupContext from "../../../../components/WalletGroupProvider/WalletGroupContext";
import {WalletGroup} from "../../../../components/Modals/WalletSelector/WalletConfig";
import RecentTransactionProvider from "../../../../components/RecentTransactionProvider/RecentTransactionProvider";
import UIThemeProvider from "../../../../components/UIThemeProvider/UIThemeProvider";
import UIThemeContext from "../../../../components/UIThemeProvider/UIThemeContext";
import {UIThemeConfigs} from "../../../../components/UIThemeProvider/UIThemeConfig";
import {checkBlockedRegion} from "../../../../utils/RegionUtil";
import NotificationProvider from "../../../../components/NotificationProvider/NotificationProvider";
import TopNotificationTipsProvider from "../../../../components/TopNotificationTipsProvider/TopNotificationTipsProvider";
import DataTabProvider from "../../../../components/DataTabProvider/DataTabProvider";
import TradingBg from "../../../../components/TradingBg";
import TransactionSenderProvider from "../../../../components/Transaction/TransactionSenderProvider";
import {darkWalletThemeConfig, lightWalletThemeConfig, WalletConnectorDisclaimer} from "./WalletsDAPPLayout";

const DAppReadOnlyUrlConfig = {
    [Arbitrum.chainId]: ApplicationConfig.RPCForArbitrumMainnet,
    [ArbitrumSepoliaChain.chainId]: ApplicationConfig.RPCForArbitrumSepoliaTestNet,
};

const DAppProviderConfig = {
    readOnlyChainId: DefaultChain.chainId,
    readOnlyUrls: DAppReadOnlyUrlConfig,
    networks: [...DEFAULT_SUPPORTED_CHAINS, ...SupportedExtraChains, ...SupportedCustomChains],

    noMetamaskDeactivate: true,

    connectors: {
        metamask: new MetamaskConnector(),
    },
};

const enableLocalForkSessionKey = 'enableLocalFork';
const enableForkServerSessionKey = 'enableForkServer';










const defaultZeroDevProjectId = import.meta.env.VITE_ZERODEV_PROJECT_ID || '';
const supportedWagmiChains = buildSupportedWagmiChains();
const {chains: configuredChains, publicClient: provider, webSocketPublicClient: webSocketProvider} = configureChainsV1(
    // [convertToWagmiChain(ArbitrumGoerliChain), convertToWagmiChain(DefaultChain)],
    supportedWagmiChains,
    [publicProviderV1()],
);
console.debug(`configuredChains =>`, configuredChains);

const rainbowkitConnectorsForAAWallet = connectorsForWalletsV1([
    {
        groupName: WalletGroup.AA.subGroup.Social.alias,
        wallets: [
            googleWallet({chains: configuredChains, options: {projectId: defaultZeroDevProjectId}}),
            facebookWallet({chains: configuredChains, options: {projectId: defaultZeroDevProjectId}}),
            githubWallet({chains: configuredChains, options: {projectId: defaultZeroDevProjectId}}),
            discordWallet({chains: configuredChains, options: {projectId: defaultZeroDevProjectId}}),
            twitterWallet({chains: configuredChains, options: {projectId: defaultZeroDevProjectId}}),
        ],
    }
]);

const rainbowkitClientForAAWallet = createClientV1({
    autoConnect: true,
    connectors: rainbowkitConnectorsForAAWallet,
    publicClient: provider,
    webSocketPublicClient: webSocketProvider,
});

const darkThemeConfig = {
    ...darkThemeV1(),
    ...darkWalletThemeConfig,
};

const lightThemeConfig = {
    ...darkThemeV1(),
    ...lightWalletThemeConfig,
};




export const SocialWalletsDAPPLayout = ({ MainContentComponent, layout }) => {
    const config = useMemo(() => {
        let readOnlyUrlConfig = DAppReadOnlyUrlConfig;

        let isLocal = window.location.port === '9024';

        let enableLocalForkForLocal = isLocal;
        let enableLocalForkSession = getLocalStorage(enableLocalForkSessionKey);
        let enableLocalFork = getQueryValue('enable_local_fork');
        if (enableLocalFork) {
            if (enableLocalFork === 'false') {
                enableLocalForkForLocal = false;
                enableLocalFork = false;
                enableLocalForkSession = false;
                saveToLocalStorage(enableLocalForkSessionKey, false);
            } else {
                saveToLocalStorage(enableLocalForkSessionKey, true);
            }
        } else {
            if (enableLocalForkSession === 'false' || enableLocalForkSession === false) {
                enableLocalForkForLocal = false;
                enableLocalFork = false;
                enableLocalForkSession = false;
            }
        }

        if (enableLocalForkForLocal || enableLocalForkSession || enableLocalFork) {
            readOnlyUrlConfig = {
                ...readOnlyUrlConfig,
                [ArbitrumForkChain.chainId]: ApplicationConfig.RPCForArbitrumMainnetLocalForkNet,
                // [ArbitrumGoerliForkChain.chainId]: ApplicationConfig.RPCForArbitrumGoerliLocalForkNet,
                // [ArbitrumHardhatForkChain.chainId]: ApplicationConfig.RPCForArbitrumHardhatLocalForkNet,
                [ArbitrumSepoliaForkChain.chainId]: ApplicationConfig.RPCForArbitrumGoerliLocalForkNet,
            };
        }

        let enableForkServerForLocal = isLocal;
        let enableForkServerSession = getLocalStorage(enableForkServerSessionKey);
        let enableForkServer = getQueryValue('enable_fork_server');
        if (enableForkServer) {
            if (enableForkServer === 'false') {
                enableForkServerForLocal = false;
                enableForkServer = false;
                enableForkServerSession = false;
                saveToLocalStorage(enableForkServerSessionKey, false);
            } else {
                saveToLocalStorage(enableForkServerSessionKey, true);
            }
        } else {
            if (enableForkServerSession === 'false' || enableForkServerSession === false) {
                enableForkServerForLocal = false;
                enableForkServer = false;
                enableForkServerSession = false;
            }
        }

        if (enableForkServerForLocal || enableForkServerSession || enableForkServer) {
            readOnlyUrlConfig = {
                ...readOnlyUrlConfig,
                [ArbitrumForkServerChain.chainId]: ApplicationConfig.RPCForArbitrumMainnetForkServerNet,
                [ArbitrumHardhatForkServerChain.chainId]: ApplicationConfig.RPCForArbitrumHardhatForkServerNet,
            };
        }

        let dappConfig = {
            ...DAppProviderConfig,
            readOnlyUrls: readOnlyUrlConfig,
        };
        console.debug(`DAppProviderConfig => `, dappConfig);
        return dappConfig;
    }, []);

    useEffect(() => {
        cacheDefaultTokens();
        console.debug(
            `cached default tokens`,
        );
    }, []);

    const [wagmiConfig, setWagmiConfig] = useState(rainbowkitClientForAAWallet);



    const uiThemeContext = useContext(UIThemeContext);
    const [rainbowKitTheme, setRainbowKitTheme] = useState(darkThemeConfig);
    useEffect(() => {
        let lightUITheme = UIThemeConfigs[1];
        if(uiThemeContext?.theme?.name === lightUITheme?.name){
            // console.debug(`lightThemeConfig =>`, lightThemeConfig);
            setRainbowKitTheme(lightThemeConfig);
        } else {
            // console.debug(`darkThemeConfig =>`, darkThemeConfig);
            setRainbowKitTheme(darkThemeConfig);
        }
    }, [uiThemeContext]);


    const currentPath = window.location.pathname;
    const [blockCurrentRegionChecked, setBlockCurrentRegionChecked] = useState(false);
    useEffect(() => {
        setBlockCurrentRegionChecked(() => {
            return false;
        });

        // check region
        let enableRegionBlockerEnv = import.meta.env.VITE_ENABLE_REGION_BLOCKER;
        console.debug(`enableRegionBlockerEnv =>`, enableRegionBlockerEnv);
        if (enableRegionBlockerEnv !== 'false') {
            let intercept = true;
            checkBlockedRegion((checked) => {
                setBlockCurrentRegionChecked(checked);
            }, intercept);
        } else {
            setBlockCurrentRegionChecked(true);
        }
    }, [currentPath]);

    return (
        <WagmiConfigV1 config={wagmiConfig}>
            <RainbowKitProviderV1
                theme={rainbowKitTheme}
                chains={configuredChains}
                modalSize="compact"
                appInfo={{
                    appName: 'Drake Exchange',
                    disclaimer: WalletConnectorDisclaimer,
                }}
            >
                <DAppProvider config={config}>
                    <WebThreeProvider>
                        <PageInfoProvider>
                            <NotificationProvider>
                                <TransactionContextProvider>
                                    <TransactionSenderProvider>
                                        <RecentTransactionProvider>
                                            <I18nProvider>
                                                <PortfolioTypeProvider>
                                                    <InstrumentProvider>
                                                        <DataTabProvider>
                                                            <DemoTradingProvider>
                                                                <div className="main_container">
                                                                    <div className={`large_container`}>
                                                                        <TradingBg/>

                                                                        <TopNotificationTipsProvider>
                                                                            <Header layout={layout}/>

                                                                            {blockCurrentRegionChecked && (
                                                                                <MainContentComponent/>
                                                                            )}

                                                                            <Footer layout={layout}/>
                                                                        </TopNotificationTipsProvider>
                                                                    </div>
                                                                </div>
                                                            </DemoTradingProvider>
                                                        </DataTabProvider>
                                                    </InstrumentProvider>
                                                </PortfolioTypeProvider>
                                            </I18nProvider>
                                        </RecentTransactionProvider>
                                    </TransactionSenderProvider>
                                </TransactionContextProvider>
                            </NotificationProvider>
                        </PageInfoProvider>
                    </WebThreeProvider>
                </DAppProvider>
            </RainbowKitProviderV1>
        </WagmiConfigV1>
    );
};

