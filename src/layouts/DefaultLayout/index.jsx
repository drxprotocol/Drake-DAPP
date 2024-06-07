import React, { useMemo, useEffect, useState } from 'react';
import Header from './components/Header';
import NewFooter from './components/NewFooter';

import '../../assets/css/tailwind.css';

import './index.scss';
import './theme_light.scss';
import '../../components/Icons/index.scss';
import '../../components/Coin/index.scss';
import '../../components/DAPPForm/index.scss';

import { Mainnet, Arbitrum, DAppProvider, DEFAULT_SUPPORTED_CHAINS, MetamaskConnector } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';
import WebThreeProvider from '../../components/WebThreeProvider/WebThreeProvider';
import { cacheDefaultTokens } from '../../contract/TokenContract';
import PageInfoProvider from '../../components/PageInfoProvider/PageInfoProvider';
import TransactionContextProvider from '../../components/Transaction/TransactionContextProvider';
import {
    ArbitrumForkChain,
    ArbitrumForkServerChain,
    ArbitrumHardhatForkChain,
    ArbitrumHardhatForkServerChain,
    ArbitrumSepoliaChain,
    ArbitrumSepoliaForkChain,
    DefaultChain
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
import {checkBlockedRegion} from "../../utils/RegionUtil";
import {BlockTipsBar} from "./components/Header/components/BlockTipsBar";
import TopNotificationTipsProvider from "../../components/TopNotificationTipsProvider/TopNotificationTipsProvider";

const DAppReadOnlyUrlConfig = {
    [Arbitrum.chainId]: ApplicationConfig.RPCForArbitrumMainnet,
    // [Mainnet.chainId]: getDefaultProvider('mainnet'),
};

const DAppReadOnlyUrlConfigForWalletConnect = {
    [Arbitrum.chainId]: ApplicationConfig.RPCForArbitrumMainnet,
    [ArbitrumForkServerChain.chainId]: ApplicationConfig.RPCForArbitrumMainnetForkServerNet,
};

const DAppProviderConfig = {
    readOnlyChainId: DefaultChain.chainId,
    readOnlyUrls: DAppReadOnlyUrlConfig,
    networks: [...DEFAULT_SUPPORTED_CHAINS, ArbitrumForkChain, ArbitrumForkServerChain, ArbitrumHardhatForkChain, ArbitrumHardhatForkServerChain, ArbitrumSepoliaChain, ArbitrumSepoliaChain],

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

const DefaultLayout = ({ MainContentComponent, layout }) => {
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
                [ArbitrumHardhatForkChain.chainId]: ApplicationConfig.RPCForArbitrumHardhatLocalForkNet,
                [ArbitrumSepoliaForkChain.chainId]: ApplicationConfig.RPCForArbitrumSepoliaLocalForkNet,
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
    }, []);


    const currentPath = window.location.pathname;
    const [blockCurrentRegionChecked, setBlockCurrentRegionChecked] = useState(true);
    useEffect(() => {
        setBlockCurrentRegionChecked(() => {
            return true;
        });

        // check region
        let enableRegionBlockerEnv = import.meta.env.VITE_ENABLE_REGION_BLOCKER;
        console.debug(`enableRegionBlockerEnv =>`, enableRegionBlockerEnv);
        if (enableRegionBlockerEnv !== 'false') {
            checkBlockedRegion((checked) => {
                setBlockCurrentRegionChecked(checked);
            });
        } else {
            setBlockCurrentRegionChecked(true);
        }
    }, [currentPath]);

    return (
        <DAppProvider config={config}>
            <WebThreeProvider>
                <PageInfoProvider>
                    <TransactionContextProvider>
                        <I18nProvider>
                            <PortfolioTypeProvider>
                                <InstrumentProvider>
                                    <DemoTradingProvider>
                                        <div className="main_container">
                                            <TopNotificationTipsProvider>
                                                {!blockCurrentRegionChecked && (
                                                    <BlockTipsBar/>
                                                )}

                                                <Header layout={layout}/>
                                                <MainContentComponent/>
                                                <NewFooter layout={layout}/>
                                            </TopNotificationTipsProvider>
                                        </div>
                                    </DemoTradingProvider>
                                </InstrumentProvider>
                            </PortfolioTypeProvider>
                        </I18nProvider>
                    </TransactionContextProvider>
                </PageInfoProvider>
            </WebThreeProvider>
        </DAppProvider>
    );
};

export default DefaultLayout;
