import React, {useState, useMemo, useEffect, useContext} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

import '../../assets/css/tailwind.css';
import '@rainbow-me/rainbowkit/styles.css'

import './index.scss';
import './theme_light.scss';
import '../../components/Icons/index.scss';
import '../../components/Coin/index.scss';
import '../../components/DAPPForm/index.scss';

import {
    WagmiConfig,
    configureChains,
    createConfig as createClient,
} from "wagmi";
import { arbitrumGoerli, arbitrum } from 'wagmi/chains'
import {publicProvider} from 'wagmi/providers/public'
import {connectorsForWallets, RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit'
import {
    facebookWallet,
    githubWallet,
    discordWallet,
    enhanceWalletWithAAConnector,
} from '@zerodev/wagmi/rainbowkit'
import {
    metaMaskWallet,
    walletConnectWallet,
    okxWallet,
    rainbowWallet,
    coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { Mainnet, Arbitrum, DAppProvider, DEFAULT_SUPPORTED_CHAINS, MetamaskConnector } from '@usedapp/core';
import WebThreeProvider from '../../components/WebThreeProvider/WebThreeProvider';
import { cacheDefaultTokens } from '../../contract/TokenContract';
import PageInfoProvider from '../../components/PageInfoProvider/PageInfoProvider';
import TransactionContextProvider from '../../components/Transaction/TransactionContextProvider';
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
} from '../../contract/ChainConfig';
import { getQueryValue } from '../../utils/URLUtil';
import ApplicationConfig from '../../ApplicationConfig';
import { getLocalStorage, saveToLocalStorage } from '../../utils/LocalStorage';
import { WalletConnectConnector } from '../../components/Wallet-Connect-Connector';
import { OKXConnector } from '../../components/Wallet-Connect-OKX-Connector';
import {I18nProvider, initializeDefaultLanguage} from "../../components/i18n";
import PortfolioTypeProvider from "../../components/PortfolioTypeProvider/PortfolioTypeProvider";
import DemoTradingProvider from "../../components/DemoTradingProvider/DemoTradingProvider";
import InstrumentProvider from "../../components/InstrumentProvider/InstrumentProvider";
import {twitterWallet, googleWallet} from "../../components/WalletConnectors";
import WalletGroupProvider from "../../components/WalletGroupProvider/WalletGroupProvider";
import WalletGroupContext from "../../components/WalletGroupProvider/WalletGroupContext";
import {WalletGroup} from "../../components/Modals/WalletSelector/WalletConfig";
import RecentTransactionProvider from "../../components/RecentTransactionProvider/RecentTransactionProvider";
import UIThemeProvider from "../../components/UIThemeProvider/UIThemeProvider";
import UIThemeContext from "../../components/UIThemeProvider/UIThemeContext";
import {UIThemeConfigs} from "../../components/UIThemeProvider/UIThemeConfig";
import {checkBlockedRegion} from "../../utils/RegionUtil";
import NotificationProvider from "../../components/NotificationProvider/NotificationProvider";
import TopNotificationTipsProvider from "../../components/TopNotificationTipsProvider/TopNotificationTipsProvider";
import DataTabProvider from "../../components/DataTabProvider/DataTabProvider";
import TradingBg from "../../components/TradingBg";
import TransactionSenderProvider from "../../components/Transaction/TransactionSenderProvider";

const DAppReadOnlyUrlConfig = {
    [Arbitrum.chainId]: ApplicationConfig.RPCForArbitrumMainnet,
    [ArbitrumSepoliaChain.chainId]: ApplicationConfig.RPCForArbitrumSepoliaTestNet,
};

const DAppReadOnlyUrlConfigForWalletConnect = {
    [Arbitrum.chainId]: ApplicationConfig.RPCForArbitrumMainnet,
    [ArbitrumSepoliaChain.chainId]: ApplicationConfig.RPCForArbitrumSepoliaTestNet,
    [ArbitrumForkServerChain.chainId]: ApplicationConfig.RPCForArbitrumMainnetForkServerNet,
};

const DAppProviderConfig = {
    readOnlyChainId: DefaultChain.chainId,
    readOnlyUrls: DAppReadOnlyUrlConfig,
    networks: [...DEFAULT_SUPPORTED_CHAINS, ...SupportedExtraChains, ...SupportedCustomChains],

    noMetamaskDeactivate: true,

    connectors: {
        metamask: new MetamaskConnector(),
        okx: new OKXConnector(),
        walletConnect: new WalletConnectConnector({
            rpc: DAppReadOnlyUrlConfigForWalletConnect,
            qrcodeModalOptions: {
                mobileLinks: [
                    'metamask',
                    'okx',
                    'rainbow',
                    'argent',
                    'trust',
                    'imtoken',
                    'mathwallet',
                    'tokenPocket',
                    'defi wallet',
                ],
            },
        }),
    },
};

const enableLocalForkSessionKey = 'enableLocalFork';
const enableForkServerSessionKey = 'enableForkServer';










const defaultZeroDevProjectId = import.meta.env.VITE_ZERODEV_PROJECT_ID || '';
const defaultWalletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';
const supportedWagmiChains = buildSupportedWagmiChains();
const {chains: configuredChains, publicClient: provider, webSocketPublicClient: webSocketProvider} = configureChains(
    // [convertToWagmiChain(ArbitrumGoerliChain), convertToWagmiChain(DefaultChain)],
    supportedWagmiChains,
    [publicProvider()],
);
console.debug(`configuredChains =>`, configuredChains);
const rainbowkitConnectorsForEOAWallet = connectorsForWallets([
    {
        groupName: WalletGroup.EOA.alias,
        wallets: [
            metaMaskWallet({
                chains: configuredChains,
                projectId: defaultWalletConnectProjectId,
            }),
            walletConnectWallet({
                chains: configuredChains,
                projectId: defaultWalletConnectProjectId,
                options: {
                    qrcodeModalOptions: {
                        desktopLinks: ["metamask"],
                        mobileLinks: ["metamask", "trust", "rainbow", "argent", "imtoken", "pillar"],
                    },
                },
            }),
            okxWallet({
                chains: configuredChains,
                projectId: defaultWalletConnectProjectId,
            }),
            // rainbowWallet({
            //     chains: configuredChains,
            // }),
            coinbaseWallet({
                appName: 'Drake',
                chains: configuredChains,
                projectId: defaultWalletConnectProjectId,
            }),
        ],
    },
]);

const rainbowkitConnectorsForAAWallet = connectorsForWallets([
    {
        groupName: WalletGroup.AA.subGroup.Social.alias,
        wallets: [
            googleWallet({chains: configuredChains, options: {projectId: defaultZeroDevProjectId}}),
            facebookWallet({chains: configuredChains, options: {projectId: defaultZeroDevProjectId}}),
            githubWallet({chains: configuredChains, options: {projectId: defaultZeroDevProjectId}}),
            discordWallet({chains: configuredChains, options: {projectId: defaultZeroDevProjectId}}),
            twitterWallet({chains: configuredChains, options: {projectId: defaultZeroDevProjectId}}),
        ],
    },
    {
        groupName: WalletGroup.AA.subGroup.WrappedEOA.alias,
        wallets: [
            enhanceWalletWithAAConnector(
                metaMaskWallet({
                    chains: configuredChains,
                    projectId: defaultWalletConnectProjectId
                }),
                {projectId: defaultZeroDevProjectId}
            ),
            enhanceWalletWithAAConnector(
                okxWallet({
                    chains: configuredChains,
                    projectId: defaultWalletConnectProjectId
                }),
                {projectId: defaultZeroDevProjectId}
            ),
            enhanceWalletWithAAConnector(
                coinbaseWallet({
                    appName: 'Drake',
                    chains: configuredChains,
                    projectId: defaultWalletConnectProjectId
                }),
                {projectId: defaultZeroDevProjectId}
            ),
        ],
    },
]);

const rainbowkitClientForAAWallet = createClient({
    autoConnect: true,
    connectors: rainbowkitConnectorsForAAWallet,
    publicClient: provider,
    webSocketPublicClient: webSocketProvider,
});

const rainbowkitClientForEOAWallet = createClient({
    autoConnect: true,
    connectors: rainbowkitConnectorsForEOAWallet,
    publicClient: provider,
    webSocketPublicClient: webSocketProvider,
});

const Disclaimer = () => {
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
                <div className={'c_link cp'} onClick={switchGroup}>{`Connect with ${walletGroupContext?.group === WalletGroup.EOA.name ? WalletGroup.AA.alias : WalletGroup.EOA.alias}`}</div>
            </div>
        </div>
    );
};

const darkThemeConfig = {
    ...darkTheme(),
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

const lightThemeConfig = {
    ...darkTheme(),
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




const AALayoutComponent = ({ MainContentComponent, layout }) => {
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

        // console.debug(
        //     `rainbowkitConnectors =>`, rainbowkitConnectors,
        //     `rainbowkitClient =>`, rainbowkitClient,
        //     `configuredChains =>`, configuredChains,
        //     `config =>`, config,
        // )
    }, []);

    const [wagmiConfig, setWagmiConfig] = useState(rainbowkitClientForEOAWallet);

    const walletGroupContext = useContext(WalletGroupContext);
    useEffect(() => {
        let _wagmiConfig = walletGroupContext?.group === WalletGroup.AA.name ? rainbowkitClientForAAWallet : rainbowkitClientForEOAWallet;
        console.debug(`_wagmiConfig =>`, _wagmiConfig, `walletGroupContext =>`, walletGroupContext);

        setWagmiConfig(_wagmiConfig);
    }, [walletGroupContext]);




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
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
                theme={rainbowKitTheme}
                chains={configuredChains}
                modalSize="compact"
                appInfo={{
                    appName: 'Drake Exchange',
                    disclaimer: Disclaimer,
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
            </RainbowKitProvider>
        </WagmiConfig>
    );
};

export const AALayout = ({ MainContentComponent, layout }) => {
    return (
        <WalletGroupProvider>
            <UIThemeProvider>
                <AALayoutComponent MainContentComponent={MainContentComponent} layout={layout} />
            </UIThemeProvider>
        </WalletGroupProvider>
    );
};

