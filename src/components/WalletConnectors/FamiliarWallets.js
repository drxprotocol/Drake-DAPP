import i_wallet_coinbase from "../Icons/img/i_wallet_coinbase.svg";
import { createConnector } from "wagmi";
import { coinbaseWallet as coinbaseSmartWagmiWallet } from 'wagmi/connectors';
import {
    coinbaseWallet as coinbaseWagmiWallet,
} from '@rainbow-me/rainbowkit/wallets';

export const coinbaseSmartWallet = ({appName, appIcon}) => {
    let _coinbaseWallet = coinbaseWagmiWallet({appName, appIcon});
    _coinbaseWallet = {
        ..._coinbaseWallet,
        iconBackground: "#fff",
        iconUrl: i_wallet_coinbase,
        id: "coinbase_smart",
        name: "Coinbase Smart Wallet",
        createConnector: (walletDetails) => createConnector((config) => ({
            ...coinbaseSmartWagmiWallet({
                appName,
                headlessMode: false,
                preference: 'smartWalletOnly',
            })(config),
            ...walletDetails
        }))
    };

    // console.debug(
    //     `create coinbase smart wallet:`,
    //     `_coinbaseWallet =>`, _coinbaseWallet,
    // );

    return _coinbaseWallet;
};