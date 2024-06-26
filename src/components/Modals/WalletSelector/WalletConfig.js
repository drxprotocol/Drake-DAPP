export const WalletGroup = {
    EOA: {
        name: 'EOA',
        alias: 'EOA Wallet',
    },
    AA: {
        name: 'AA',
        alias: 'AA Wallet',
        subGroup: {
            WrappedEOA: {
                name: 'WrappedEOA',
                alias: 'AA EOA Wallet',
            },
            Social: {
                name: 'Social',
                alias: 'AA Social Wallet',
            },
        }
    },

    Familiar: {
        name: 'Familiar',
        alias: 'Familiar Wallets',
        subGroup: {
            Recommended: {
                name: 'Suggested',
                alias: 'Suggested Wallets',
            },
            Popular: {
                name: 'Popular',
                alias: 'Popular Wallets',
            },
        }
    },
    Social: {
        name: 'Social',
        alias: 'AA Social Wallets',
    },
};

export const WalletMap = {
    injected: {
        name: 'MetaMask',
        icon: 'i_metamask',
    },
    MetaMask: {
        name: 'MetaMask',
        icon: 'i_metamask',
    },
    walletconnect: {
        name: 'WalletConnect',
        icon: 'i_walletconnect',
    },
    okx: {
        name: 'OKX Wallet',
        icon: 'i_okx_wallet',
    },
    walletlink: {
        name: 'Coinbase',
        icon: 'i_coinbase',
    },
    Coinbase: {
        name: 'Coinbase Wallet',
        icon: 'i_wallet_coinbase',
    },
    CoinbaseSmart: {
        connectorId: 'coinbaseWalletSDK',
        name: 'Coinbase Smart Wallet',
        icon: 'i_wallet_coinbase',
    },

    Google: {
        name: 'Google',
        icon: 'i_wallet_google',
    },
    Github: {
        name: 'Github',
        icon: 'i_wallet_github',
    },
    Facebook: {
        name: 'Facebook',
        icon: 'i_wallet_facebook',
    },
    Discord: {
        name: 'Discord',
        icon: 'i_wallet_discord',
    },
    Twitter: {
        name: 'Twitter',
        icon: 'i_wallet_twitter',
    },
};

export const getWalletByName = (name) => {
    for (let item in WalletMap) {
        if (WalletMap.hasOwnProperty(item)) {
            let wallet = WalletMap[item];
            if(wallet.name === name){
                return wallet;
            }
        }
    }

    return WalletMap.injected;
};

export const checkSocialWallet = (name) => {
    let aaWallets = [WalletMap.Google.name, WalletMap.Github.name, WalletMap.Facebook.name, WalletMap.Discord.name, WalletMap.Twitter.name, WalletMap.CoinbaseSmart.name];
    let isAA = aaWallets.includes(name);
    return isAA;
};

export const WalletConfig = [
    {
        name: WalletMap.injected.name,
        connector: 'injected',
        icon: WalletMap.injected.icon,
        des: 'Connect with MetaMask wallet',
        enable: () => {
            if (window.ethereum) {
                return !window.ethereum?.isOkxWallet;
            }

            return false;
        },
    },
    {
        name: WalletMap.okx.name,
        connector: 'injected',
        icon: WalletMap.okx.icon,
        des: 'OKX wallet',
        enable: () => {
            if (window.okxwallet) {
                return window.ethereum?.isOkxWallet;
            }

            return false;
        },
    },
    {
        name: WalletMap.walletconnect.name,
        connector: 'walletconnect',
        icon: WalletMap.walletconnect.icon,
        des: 'Connect with Walletconnect',
    },
    // {
    //     name:WalletMap.walletlink.name,
    //     connector:'walletlink',
    //     icon:WalletMap.walletlink.icon,
    //     des:'Connect with Coinbase wallet'
    // }
];
