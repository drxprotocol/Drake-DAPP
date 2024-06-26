import { providers } from 'ethers';
import { ConnectorEvent } from '@usedapp/core';
import detectEthereumProvider from '@metamask/detect-provider';

export async function getOKXProvider() {
    const injectedProviders = window?.ethereum.providers || [];
    const injectedProvider =
        injectedProviders.find((provider) => {
            return provider.isMetaMask ?? false;
        }) ?? (await detectEthereumProvider());

    if (!injectedProvider) {
        console.log(`OKX is not installed`);
        return undefined;
    }

    const provider = new providers.Web3Provider(injectedProvider, 'any');
    return provider;
}

export class OKXConnector {
    provider = undefined;
    name = 'OKX';

    update = new ConnectorEvent();

    async init() {
        if (this.provider) return;
        const okx = await getOKXProvider();
        if (!okx) {
            return;
        }
        this.provider = okx;
    }

    async connectEagerly() {
        await this.init();

        if (!this.provider) {
            return;
        }

        try {
            const chainId = await this.provider.send('eth_chainId', []);
            const accounts = await this.provider.send('eth_accounts', []);
            this.update.emit({ chainId: parseInt(chainId, 16), accounts });
        } catch (e) {
            console.debug(e);
        }
    }

    async activate() {
        await this.init();

        if (!this.provider) {
            throw new Error('Could not activate connector');
        }

        try {
            const chainId = await this.provider.send('eth_chainId', []);
            const accounts = await this.provider.send('eth_requestAccounts', []);
            this.update.emit({ chainId: parseInt(chainId, 16), accounts });
        } catch (e) {
            console.log(e);
            throw new Error('Could not activate connector: ' + (e.message ?? ''));
        }
    }

    async deactivate() {
        this.provider = undefined;
    }
}
