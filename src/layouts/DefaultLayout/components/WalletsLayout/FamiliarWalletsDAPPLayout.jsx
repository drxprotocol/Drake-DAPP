import React, {useState, useMemo, useEffect, useContext} from 'react';
import Header from '../Header/index';
import Footer from '../Footer/index';

import {
    WagmiConfig,
    createConfig as createClient,
    http,
} from "wagmi";
import { baseSepolia } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {connectorsForWallets, RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit'

import {
    metaMaskWallet,
    walletConnectWallet,
    okxWallet,
    coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {coinbaseSmartWallet} from "../../../../components/WalletConnectors/FamiliarWallets";

import { Mainnet, Arbitrum, DAppProvider, DEFAULT_SUPPORTED_CHAINS, MetamaskConnector } from '@usedapp/core';
import WebThreeProvider from '../../../../components/WebThreeProvider/WebThreeProvider';
import { cacheDefaultTokens } from '../../../../contract/TokenContract';
import PageInfoProvider from '../../../../components/PageInfoProvider/PageInfoProvider';
import TransactionContextProvider from '../../../../components/Transaction/TransactionContextProvider';
import {
    ArbitrumForkChain,
    ArbitrumForkServerChain,
    ArbitrumHardhatForkChain,
    ArbitrumHardhatForkServerChain,
    ArbitrumSepoliaChain,
    ArbitrumSepoliaForkChain,
    BaseSepoliaTestChain,
    buildSupportedWagmiChains, buildSupportedWagmiChainsTransports, convertToWagmiChain,
    DefaultChain, SupportedCustomChains, SupportedExtraChains
} from '../../../../contract/ChainConfig';
import { getQueryValue } from '../../../../utils/URLUtil';
import ApplicationConfig from '../../../../ApplicationConfig';
import { getLocalStorage, saveToLocalStorage } from '../../../../utils/LocalStorage';
import PortfolioTypeProvider from "../../../../components/PortfolioTypeProvider/PortfolioTypeProvider";
import DemoTradingProvider from "../../../../components/DemoTradingProvider/DemoTradingProvider";
import InstrumentProvider from "../../../../components/InstrumentProvider/InstrumentProvider";
import {WalletGroup} from "../../../../components/Modals/WalletSelector/WalletConfig";
import RecentTransactionProvider from "../../../../components/RecentTransactionProvider/RecentTransactionProvider";
import UIThemeContext from "../../../../components/UIThemeProvider/UIThemeContext";
import {UIThemeConfigs} from "../../../../components/UIThemeProvider/UIThemeConfig";
import {checkBlockedRegion} from "../../../../utils/RegionUtil";
import NotificationProvider from "../../../../components/NotificationProvider/NotificationProvider";
import TopNotificationTipsProvider from "../../../../components/TopNotificationTipsProvider/TopNotificationTipsProvider";
import DataTabProvider from "../../../../components/DataTabProvider/DataTabProvider";
import TradingBg from "../../../../components/TradingBg";
import TransactionSenderProvider from "../../../../components/Transaction/TransactionSenderProvider";
import I18nContext from "../../../../components/i18n/I18nContext";
import {darkWalletThemeConfig, lightWalletThemeConfig, WalletConnectorDisclaimer} from "./WalletsDAPPLayout";

const defaultQueryClient = new QueryClient();

const DAppReadOnlyUrlConfig = {
    [Arbitrum.chainId]: ApplicationConfig.RPCForArbitrumMainnet,
    [ArbitrumSepoliaChain.chainId]: ApplicationConfig.RPCForArbitrumSepoliaTestNet,
    [BaseSepoliaTestChain.chainId]: ApplicationConfig.RPCForBaseSepoliaTestNet,
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










const defaultWalletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';
const supportedWagmiChains = buildSupportedWagmiChains();
const supportedWagmiChainsTransports = buildSupportedWagmiChainsTransports();

const rainbowkitConnectorsForEOAWallet = connectorsForWallets(
    [
        {
            groupName: WalletGroup.Familiar.subGroup.Recommended.alias,
            wallets: [
                metaMaskWallet,
                coinbaseSmartWallet,
            ],
        },
        {
            groupName: WalletGroup.Familiar.subGroup.Popular.alias,
            wallets: [
                metaMaskWallet,
                walletConnectWallet,
                okxWallet,
                coinbaseWallet,
            ],
        },
    ],
    {
        appName: 'Drake',
        projectId: defaultWalletConnectProjectId,
    }
);


const rainbowkitClientForEOAWallet = createClient({
    chains: supportedWagmiChains,
    transports: supportedWagmiChainsTransports,
    connectors: rainbowkitConnectorsForEOAWallet,
});


const darkThemeConfig = {
    ...darkTheme(),
    ...darkWalletThemeConfig,
};

const lightThemeConfig = {
    ...darkTheme(),
    ...lightWalletThemeConfig,
};




export const FamiliarWalletsDAPPLayout = ({ MainContentComponent, layout }) => {
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

    const [wagmiConfig, setWagmiConfig] = useState(rainbowkitClientForEOAWallet);


    const uiThemeContext = useContext(UIThemeContext);
    const i18nContext = useContext(I18nContext);
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
        <WagmiConfig config={wagmiConfig}>
            <QueryClientProvider client={defaultQueryClient}>
                <OnchainKitProvider chain={baseSepolia} schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9">
                    <RainbowKitProvider
                        theme={rainbowKitTheme}
                        modalSize="compact"
                        appInfo={{
                            appName: 'Drake Exchange',
                            disclaimer: WalletConnectorDisclaimer,
                        }}
                        locale={i18nContext.lang || 'en'}
                    >
                        <DAppProvider config={config}>
                            <WebThreeProvider>
                                <PageInfoProvider>
                                    <NotificationProvider>
                                        <TransactionContextProvider>
                                            <TransactionSenderProvider>
                                                <RecentTransactionProvider>
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
                                                </RecentTransactionProvider>
                                            </TransactionSenderProvider>
                                        </TransactionContextProvider>
                                    </NotificationProvider>
                                </PageInfoProvider>
                            </WebThreeProvider>
                        </DAppProvider>
                    </RainbowKitProvider>
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiConfig>
    );
};
