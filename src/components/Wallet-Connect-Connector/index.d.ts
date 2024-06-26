import { Connector } from '@usedapp/core';
import { providers } from 'ethers';
import { ConnectorEvent, ConnectorUpdateData } from '@usedapp/core';
import { IWalletConnectProviderOptions } from '@walletconnect/types';
export declare class WalletConnectConnector implements Connector {
    private opts;
    provider?: providers.Web3Provider;
    readonly name = 'WalletConnect';
    readonly update: ConnectorEvent<ConnectorUpdateData>;
    private walletConnectProvider;
    constructor(opts: IWalletConnectProviderOptions);
    private init;
    connectEagerly(): Promise<void>;
    activate(): Promise<void>;
    deactivate(): Promise<void>;
}
