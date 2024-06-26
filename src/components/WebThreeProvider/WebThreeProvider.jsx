import React, {useState, useMemo, useEffect, useContext} from 'react';
import WebThreeContext from './WebThreeContext';
import { useEthers } from '@usedapp/core';
import ApplicationConfig from '../../ApplicationConfig';
import { generateAddressSummary } from '../../utils/StringFormat';
import {ChainLocalNameMap, DefaultChain} from '../../contract/ChainConfig';
import {useAccount, useConnect} from "wagmi";
import {
    useEthersSigner as useSigner,
    useEthersProvider as useProvider,
} from "../EthersAdapters";
import {WalletMap} from "../Modals/WalletSelector/WalletConfig";

const useWebThreeContextFromWagmi = () => {
    const [updated, setUpdated] = useState(false);
    const [context, setContext] = useState({});
    const [currentChainId, setCurrentChainId] = useState(0);

    const {chain: activeChain} = useAccount();
    const web3Provider = useProvider({chainId: activeChain?.id});
    const web3Account = useAccount();
    const [currentAccount, setCurrentAccount] = useState('');
    const [currentSignerAddress, setCurrentSignerAddress] = useState('');
    const {data: web3Signer, signerAddress} = useSigner({chainId: activeChain?.id});

    // useEffect(() => {
    //     console.debug(`useWebThreeContextFromWagmi web3Account =>`, web3Account);
    // }, [web3Account]);

    useEffect(() => {
        let chainId = activeChain?.id;
        let accountAddress = web3Account?.address;
        let connectorName = web3Account?.connector?.name || 'MetaMask';
        if(web3Account?.connector?.id === WalletMap.CoinbaseSmart.connectorId){
            connectorName = WalletMap.CoinbaseSmart.name;
        }

        let _connected = chainId && accountAddress;
        let _context = {
            account: accountAddress,
            chainId: chainId,
            library: web3Provider,
            signer: web3Signer,
            connectStrategy: _connected ? ApplicationConfig.walletConnectStrategy.rainbowKit : ApplicationConfig.walletConnectStrategy.none,
            connectorName: connectorName,
        };

        let _updated = false;
        if (!_connected) {
            console.debug(
                `disconnect...`
            );
            _updated = true;
        }

        if(_connected && web3Signer && signerAddress){
            console.debug(
                `useWebThreeContextFromWagmi: web3Signer =>`, web3Signer,
                `signerAddress =>`, signerAddress,
                `accountAddress =>`, accountAddress,
            );

            if(chainId !== currentChainId && !activeChain.unsupported){
                console.debug(
                    `switched to new network[chainId=${chainId}]`
                );

                setCurrentChainId(chainId);
                _updated = true;
            }

            if(accountAddress !== currentAccount){
                console.debug(
                    `connected account:`, accountAddress,
                );

                setCurrentAccount(accountAddress);
                _updated = true;
            }

            if(signerAddress !== currentSignerAddress){
                console.debug(
                    `connected signerAddress:`, signerAddress,
                );

                setCurrentSignerAddress(signerAddress);
                _updated = true;
            }
        }

        setUpdated(_updated);
        setContext(_context);

    }, [web3Provider, web3Signer, web3Account?.address, activeChain?.id]);

    return {
        updated,
        context,
    }
};

const WebThreeContextForWagmi = () => {
    const web3Context = useContext(WebThreeContext);

    const {updated: contextUpdated, context: contextFromWagmi} = useWebThreeContextFromWagmi();

    useEffect(() => {
        if (contextUpdated) {
            web3Context.dispatch(contextFromWagmi);
        }
    }, [contextUpdated, contextFromWagmi]);

    return null;
};

const WebThreeProvider = (props) => {
    const { account, chainId, library } = useEthers();

    const [context, dispatch] = useState({});

    const contextWrapper = useMemo(
        () => {
            console.debug(`updated web3 context =>`, context);

            return {
                account: context?.account || '',
                summaryAccount: generateAddressSummary(context?.account, 6),
                summaryAccountS: generateAddressSummary(context?.account, 3, 2),
                chainId: context?.account ? context?.chainId || DefaultChain.chainId : DefaultChain.chainId,
                chainName: ChainLocalNameMap[context?.chainId]?.dappLocalName || 'Unknown',
                chainNameInCoingecko: ChainLocalNameMap[context?.chainId]?.coingeckoLocalName || 'arbitrum-one',
                web3Provider: context?.library,
                web3Signer: context?.signer,
                connectStrategy: context?.connectStrategy,
                connectorName: context?.connectorName || 'MetaMask',
                dispatch: dispatch
            };
        },
        [context],
    );

    useEffect(() => {
        console.debug(`current connection info: account => `, account, `chainId => `, chainId);

        let _context = {
            account,
            chainId,
            library,
            connectStrategy: ApplicationConfig.walletConnectStrategy.useDapp
        };
        dispatch(_context);
    }, [account, chainId, library]);

    return (
        <WebThreeContext.Provider value={contextWrapper}>
            {contextWrapper.account && contextWrapper.connectStrategy === ApplicationConfig.walletConnectStrategy.rainbowKit && <WebThreeContextForWagmi/>}
            {props.children}
        </WebThreeContext.Provider>
    );
};

export default WebThreeProvider;
