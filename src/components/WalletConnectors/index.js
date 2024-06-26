import {TwitterSocialWalletConnector, GoogleSocialWalletConnector} from "@zerodev/wagmi";
import i_wallet_twitter from "../Icons/img/i_wallet_twitter.svg";
import i_wallet_google from "../Icons/img/i_wallet_google.svg";

export const twitterWallet = (param) => {
    let chains = param.chains, options = param.options;
    return {
        iconBackground: "#fff",
        iconUrl: i_wallet_twitter,
        id: "openlogin_twitter",
        name: "X",
        createConnector: function createConnector() {
            return {
                connector: new TwitterSocialWalletConnector({
                    chains: chains,
                    options: options
                })
            };
        }
    };
};

export const googleWallet = (param) => {
    let chains = param.chains, options = param.options;
    return {
        iconBackground: "#fff",
        iconUrl: i_wallet_google,
        id: "openlogin_google",
        name: "Google",
        createConnector: function createConnector() {
            return {
                connector: new GoogleSocialWalletConnector({
                    chains: chains,
                    options: options
                })
            };
        }
    };
};

