import { providers } from 'ethers';
import { ConnectorEvent } from '@usedapp/core';
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js';
export class WalletConnectConnector {
    constructor(opts) {
        this.opts = opts;
        this.name = 'WalletConnect';
        this.update = new ConnectorEvent();
    }
    async init() {
        this.walletConnectProvider = this.buildWalletConnectProvider();
        this.provider = new providers.Web3Provider(this.walletConnectProvider);

        console.debug(`WalletConnectConnector info: `, this);

        await this.walletConnectProvider.enable();
    }

    buildWalletConnectProvider() {
        let provider = new WalletConnectProvider(this.opts);
        provider?.on('accountsChanged', (accounts) => {
            console.log('ACCOUNTS_CHANGED:', accounts);
        });

        provider?.on('disconnect', (code, reason) => {
            console.log('DISCONNECT: ', code, reason);
        });

        provider?.on('chainChanged', async (chainId) => {
            console.log(`CHAIN_CHANGED: chainId => `, chainId);
        });

        provider?.on('connect', (chainId) => {
            console.log('CONNECT:', chainId);
        });

        provider?.onConnect(async () => {
            console.log('ON_CONNECT: ', provider.connected, provider.chainId);
        });

        return provider;
    }

    async connectEagerly() {
        try {
            await this.init();
            const chainId = await this.provider.send('eth_chainId', []);
            const accounts = await this.provider.send('eth_accounts', []);
            this.update.emit({ chainId: parseInt(chainId, 10), accounts });
        } catch (e) {
            console.debug(e);
        }
    }
    async activate() {
        try {
            await this.init();
            const chainId = await this.provider.send('eth_chainId', []);
            const accounts = await this.provider.send('eth_accounts', []);
            this.update.emit({ chainId: parseInt(chainId, 10), accounts });
        } catch (e) {
            console.log(e);
            throw new Error('Could not activate connector');
        }
    }
    async deactivate() {
        let _a = this.walletConnectProvider;
        if (_a && _a.disconnect) {
            _a.disconnect();
        }
        this.provider = undefined;
    }
}
