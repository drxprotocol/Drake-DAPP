/**
 * @Author: DAPP
 * @Date:   2021-06-28 09:54:46
 * @Last Modified by:   DAPP
 * @Last Modified time: 2021-09-16 22:45:06
 */
import './index.scss';
import React, {useState, useEffect, useContext, useCallback} from 'react';
import WalletSelector from '../Modals/WalletSelector';
import { useEthers } from '@usedapp/core';
import {
    useAccount,
    useConnect,
} from "wagmi";
import {
    useEthersSigner as useSigner,
    useEthersProvider as useProvider,
} from "../EthersAdapters";
import {useIntl} from "../i18n";

import {ConnectButton} from '@rainbow-me/rainbowkit';
import ConditionDisplay from "../ConditionDisplay";
import WebThreeContext from "../WebThreeProvider/WebThreeContext";
import ApplicationConfig from "../../ApplicationConfig";

export const ConnectWalletBtn = ({
    className = `f_r_c cp text_center r_12 squircle_border connect_wallet_btn`,
    txt = `commons.component.wallet.connect`,
}) => {
    const intl = useIntl();
    const { activateBrowserWallet } = useEthers();

    const [openSelector, setOpenSelector] = useState(false);
    const onOpen = () => {
        if (window.ethereum || window.okxwallet) {
            setOpenSelector(true);
        } else {
            activateBrowserWallet({ type: 'walletConnect' });
        }
    };
    const onClose = () => {
        setOpenSelector(false);
    };

    return (
        <>
            <WalletSelector isOpen={openSelector} onClose={onClose} />
            <div
                className={className}
                onClick={() => {
                    onOpen();
                }}
            >
                <div className={'i_icon_24 i_connect_wallet'}></div>
                <div className={'m_l_10 b f_16 c_link'}>{intl.get(txt)}</div>
            </div>
        </>
    );
};

const RainbowKitConnectWalletBtnRender = ({txt = `commons.component.wallet.connect`}) => {
    const intl = useIntl();

    return (
        <ConnectButton.Custom>
            {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
              }) => {
                const web3Context = useContext(WebThreeContext);
                const web3Account = useAccount();

                console.debug(
                    `connect info:`,
                    `current web3Context =>`, web3Context,
                    `web3Account =>`, web3Account,
                    `account =>`, account,
                    `chain =>`, chain,
                );



                const web3Provider = useProvider({chainId: chain?.id});

                const {chain: activeChain} = useAccount();
                const {data: web3Signer} = useSigner({chainId: chain?.id});
                useEffect(() => {
                    console.debug(
                        `current connection info: `,
                        `web3Provider => `, web3Provider,
                        `network => `, activeChain,
                        `web3Account => `, web3Account,
                        `web3Signer =>`, web3Signer,
                    );
                }, [web3Provider, web3Account, web3Signer]);

                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain && activeChain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                useEffect(() => {
                    let chainId = chain?.id;
                    let accountAddress = account?.address;

                    let _connected = chainId && accountAddress;
                    let _context = {
                        account: accountAddress,
                        chainId: chainId,
                        library: web3Provider,
                        signer: web3Signer,
                        connectStrategy: _connected ? ApplicationConfig.walletConnectStrategy.rainbowKit : ApplicationConfig.walletConnectStrategy.none
                    };
                    console.debug(
                        `current context info: `,
                        `mounted => `, mounted,
                        `authenticationStatus => `, authenticationStatus,
                        `ready => `, ready,
                        `connected => `, connected,
                        `account => `, account,
                        `chain => `, chain,
                        `web3Signer => `, web3Signer,
                        `context =>`, _context,
                        `activeChain =>`, activeChain,
                    );

                    if(_connected){
                        if(web3Signer && activeChain){
                            web3Context.dispatch(_context);
                        }
                    } else {
                        web3Context.dispatch(_context);
                    }
                }, [account?.address, chain?.id, web3Provider, web3Signer, activeChain]);


                const onOpenConnectModal = () => {
                    if(ready && !connected){
                        openConnectModal && openConnectModal();
                    }
                };

                return (
                    <div onClick={onOpenConnectModal}>{intl.get(txt)}</div>
                );
            }}
        </ConnectButton.Custom>
    );
};


const RainbowKitCoinbaseConnectWalletBtnRender = ({txt = `commons.component.wallet.connect`}) => {
    const intl = useIntl();

    return (
        <ConnectButton.Custom>
            {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
              }) => {
                const web3Context = useContext(WebThreeContext);

                const { connectAsync, connectors } = useConnect();

                const web3Provider = useProvider({chainId: chain?.id});
                const web3Account = useAccount();
                const {chain: activeChain} = useAccount();
                const {data: web3Signer} = useSigner({chainId: chain?.id});
                useEffect(() => {
                    console.debug(
                        `current connection info: `,
                        `web3Provider => `, web3Provider,
                        `network => `, activeChain,
                        `web3Account => `, web3Account,
                        `web3Signer =>`, web3Signer,
                    );
                }, [web3Provider, web3Account, web3Signer]);

                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                useEffect(() => {
                    let chainId = chain?.id;
                    let accountAddress = account?.address;

                    let _connected = chainId && accountAddress;
                    let _context = {
                        account: accountAddress,
                        chainId: chainId,
                        library: web3Provider,
                        signer: web3Signer,
                        connectStrategy: _connected ? ApplicationConfig.walletConnectStrategy.rainbowKit : ApplicationConfig.walletConnectStrategy.none
                    };
                    console.debug(
                        `current context info: `,
                        `mounted => `, mounted,
                        `authenticationStatus => `, authenticationStatus,
                        `ready => `, ready,
                        `connected => `, connected,
                        `account => `, account,
                        `chain => `, chain,
                        `web3Signer => `, web3Signer,
                        `context =>`, _context
                    );

                    if(_connected){
                        if(web3Signer && activeChain){
                            web3Context.dispatch(_context);
                        }
                    } else {
                        web3Context.dispatch(_context);
                    }
                }, [account?.address, chain?.id, web3Provider, web3Signer, activeChain]);


                const handleConnect = useCallback(async () => {
                    const connector = connectors.find((c) => c.type === 'coinbaseWallet');

                    if (connector) {
                        console.log('>> connecting', connector.type);
                        try {
                            await connectAsync({ connector });
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }, [connectAsync, connectors]);

                return (
                    <ConditionDisplay display={ready}>
                        <ConditionDisplay display={!connected}>
                            <div onClick={handleConnect}>{intl.get(txt)}</div>
                        </ConditionDisplay>
                    </ConditionDisplay>
                );
            }}
        </ConnectButton.Custom>
    );
};

export const RainbowKitConnectWalletBtn = ({
    className = `f_r_c cp text_center r_12 squircle_border connect_wallet_btn`,
    txt = `commons.component.wallet.connect`,
}) => {
    return (
        <div className={`f_r_c cp text_center r_12 squircle_border connect_wallet_btn ${className}`}>
            <div className={'i_icon_24 i_connect_wallet'}></div>
            <div className={'m_l_10 b f_16 c_link'}>
                {ApplicationConfig.enableCoinbaseAAWallet ? <RainbowKitCoinbaseConnectWalletBtnRender txt={txt}/> : <RainbowKitConnectWalletBtnRender txt={txt}/>}
            </div>
        </div>
    );
};

export const ConnectWalletBtnAdapter = ({size = 'large', className = ''}) => {
    let txt = size === 'small' ? 'commons.component.wallet.connect.s' : 'commons.component.wallet.connect';
    return ApplicationConfig.enableAAWallet ? <RainbowKitConnectWalletBtn txt={txt} className={className}/> : <ConnectWalletBtn txt={txt}/>;
};