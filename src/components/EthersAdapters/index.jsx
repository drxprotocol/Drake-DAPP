import React, {useEffect, useMemo} from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { providers } from 'ethers';
import {querySupportedChain} from "../../contract/ChainConfig";

export function publicClientToProvider(publicClient) {
    const { chain, transport } = publicClient;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };

    if (transport.type === 'fallback'){
        return new providers.FallbackProvider(
            (transport.transports).map(
                ({ value }) => new providers.JsonRpcProvider(value?.url, network),
            ),
        );
    }

    return new providers.JsonRpcProvider(transport.url, network);
};

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({chainId} = {}) {
    const publicClient = usePublicClient({ chainId });
    return useMemo(() => {
        return publicClient && publicClientToProvider(publicClient);
    }, [publicClient]);
};




export function walletClientToSigner(walletClient) {
    const { account, chain, transport } = walletClient;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain?.contracts?.ensRegistry?.address,
    };

    // console.debug(`walletClientToSigner: network =>`, network, `transport =>`, transport, `account =>`, account);

    const provider = new providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account.address);
    return {
        signer: signer,
        signerAddress: account.address,
    };
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({chainId} = {}) {
    const { data: walletClient } = useWalletClient({ chainId });

    const signer = useMemo(() => {
        if(walletClient && walletClient.account){
            console.debug(`useEthersSigner: walletClient =>`, walletClient);

            if(walletClient.chain){
                return walletClientToSigner(walletClient);
            } else {
                let chainConfig = querySupportedChain(chainId);
                if(chainConfig){
                    chainConfig = {
                        ...chainConfig,
                        id: chainId,
                    };
                    let _walletClient = {
                        ...walletClient,
                        chain: chainConfig,
                    };
                    return walletClientToSigner(_walletClient);
                }
            }
        }

        return {
            signer: undefined,
            signerAddress: undefined,
        };
    }, [walletClient]);

    return {
        data: signer.signer,
        signerAddress: signer.signerAddress,
    }
}