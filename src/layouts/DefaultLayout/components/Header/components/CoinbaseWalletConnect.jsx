import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useEthers, useEtherBalance } from '@usedapp/core';
import WebThreeContext from '../../../../../components/WebThreeProvider/WebThreeContext';
import ConditionDisplay from '../../../../../components/ConditionDisplay';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Avatar, useName } from '@coinbase/onchainkit/identity';
import CopyAddress from '../../../../../components/CopyAddress';
import ViewOnEtherscan from '../../../../../components/ViewOnEtherscan';
import ContractConfig from '../../../../../contract/ContractConfig';
import ChangeNetworkDialog from './ChangeNetworkDialog';
import ApplicationConfig from '../../../../../ApplicationConfig';
import NoProviderDialog from './NoProviderDialog';
import {ConnectWalletBtnAdapter} from '../../../../../components/ConnectWalletBtn';
import {
    checkSocialWallet,
    getWalletByName,
    WalletMap
} from "../../../../../components/Modals/WalletSelector/WalletConfig";
import {TokenAmount} from "../../../../../utils/TokenAmountConverter";
import {getToken} from "../../../../../contract/TokenContract";
import {useIntl} from "../../../../../components/i18n";
import TokenBalancesDialog from "../../../../../components/Modals/TokenBalancesDialog";
import {Popover} from "antd";
import {useDisconnect} from 'wagmi';
import {DefaultChain} from "../../../../../contract/ChainConfig";
import RecentTransactionContext from "../../../../../components/RecentTransactionProvider/RecentTransactionContext";
import {saveToLocalStorage} from "../../../../../utils/LocalStorage";
import {RECENT_TRANSACTIONS_CACHE_KEY} from "../../../../../components/RecentTransactionProvider/RecentTransactionProvider";
import BigNumber from "bignumber.js";

const CoinbaseAvatar = () => {
    const web3Context = useContext(WebThreeContext);
    const { data: name, isLoading } = useName({ address: web3Context.account });

    useEffect(() => {
        console.debug(
            `CoinbaseAvatar:`,
            `isLoading`, isLoading,
            `name`, name,
        )
    }, [name, isLoading]);

    return (
        !isLoading && name ? (<div className={`coin_base_avatar_box`}>
            <Avatar address={web3Context.account} className={'coin_base_avatar'} showAttestation  />
        </div>) : <Jazzicon diameter={24} seed={jsNumberForAddress(web3Context.account)} />
    );
};

const AvatarRender = () => {
    const web3Context = useContext(WebThreeContext);
    return (
        web3Context?.connectorName === WalletMap.Coinbase.name ? <CoinbaseAvatar/> : <Jazzicon diameter={24} seed={jsNumberForAddress(web3Context.account)} />
    );
};

export const AccountAddress = ({isAAWallet = false, recoveryEnabled = false, accountIcon = 'address', onDisconnect}) => {
    const web3Context = useContext(WebThreeContext);

    const walletIcon = useMemo(() => {
        if(web3Context.account){
            let walletName = window.localStorage.getItem('CURRENT_WALLET_NAME') || 'injected';
            let wallet = getWalletByName(walletName);
            return wallet.icon;
        }

        return WalletMap.injected.icon;
    }, [web3Context]);

    const { deactivate } = useEthers();
    const {disconnect: disconnectWithWagmi} = useDisconnect();

    const disconnect = () => {
        deactivate();
        disconnectWithWagmi();

        if (window.localStorage) {
            window.localStorage.setItem('CURRENT_WALLET_CONNECTED', 'false');
        }

        setTimeout(() => {
            onDisconnect && onDisconnect();
        }, 500);
    };

    return (
        <div className={'f_r_b account_change_box'}>
            <div className={'f_r_l'}>
                {
                    accountIcon === 'address' ?  <AvatarRender /> : <div className={`i_icon_24 ${walletIcon} m_r_5`}></div>
                }

                <div className={'f_16 c_high_light b address'}>{web3Context.summaryAccount}</div>
            </div>

            <div className={'f_r_l'}>
                <ConditionDisplay display={isAAWallet}>
                    <div className={'f_r_l p_5 r_8 bg_tag_hover m_r_10 cp'}>
                        {recoveryEnabled ? <a className={`i_icon_a i_icon_24 i_aa_recovery`} href={ApplicationConfig.aaRecoveryURI} target={'_blank'}></a> : <div className={`i_icon_24 i_aa_recovery disable`}></div>}
                    </div>
                </ConditionDisplay>

                <CopyAddress address={web3Context.account} tips={'false'} className={'p_5 r_8 bg_tag_hover'} />

                <div className={'p_5 r_8 m_l_10 bg_tag_hover'}>
                    <ViewOnEtherscan
                        url={`${ContractConfig.etherscan(web3Context.chainId)}/address/${
                            web3Context.account
                            }`}
                    />
                </div>

                <div className={'p_5 r_8 m_l_10 bg_tag_hover cp'} onClick={disconnect}>
                    <div className={'i_icon_24 i_shutdown'}></div>
                </div>
            </div>
        </div>
    );
};

const TransactionItem = ({chainId, tx}) => {
    return (
        <div className={'f_r_l_t'}>
            <div className={`tx_content f_14`}>{tx?.content}</div>

            {tx?.hash && (
                <div className={`f_r_l m_l_5`}>
                    <CopyAddress address={tx?.hash} tips={true} />
                    <ViewOnEtherscan
                        url={`${ContractConfig.etherscan(chainId)}/tx/${tx?.hash}`}
                    />
                </div>
            )}
        </div>
    );
};

const Transactions = ({className = '', onClose}) => {
    const web3Context = useContext(WebThreeContext);

    const [hasTransactions, setHasTransactions] = useState(false);
    const recentTransactionContext = useContext(RecentTransactionContext);
    useEffect(() => {
        // console.debug(`recentTransactionContext =>`, recentTransactionContext);
        if(recentTransactionContext?.pendingTransactions?.length || recentTransactionContext?.recentTransactions?.length){
            setHasTransactions(true);
        } else {
            setHasTransactions(false);
        }
    }, [recentTransactionContext]);


    const clearRecentTransaction = () => {
        saveToLocalStorage(`${RECENT_TRANSACTIONS_CACHE_KEY}_${web3Context?.account}`, []);
        recentTransactionContext.dispatch([], []);
    };

    return (
        <div className={`f_c_l default_container_p_s ${className}`}>
            <div className={'f_r_b_t'}>
                <div className={'cp i_icon_24 i_arrow_left_gray'} onClick={onClose}></div>
                <div className={'text_center b c_high_light'}>{`Transactions`}</div>
                <div className={'c_link b cp'} onClick={clearRecentTransaction}>{`Clear all`}</div>
            </div>


            <div className={'f_c_l w_100 m_t_15 gap-3'}>
                <ConditionDisplay display={!hasTransactions}>
                    <div className={'p_0_5 f_16 c_t'}>{`No transactions`}</div>
                </ConditionDisplay>


                <ConditionDisplay display={hasTransactions}>
                    {recentTransactionContext?.pendingTransactions.map((tx, key) => {
                        return (
                            <div className={'f_r_b_t c_p_12 bg_tag_hover r_12'} key={key}>
                                <TransactionItem chainId={web3Context?.chainId} tx={tx} />
                                <div className={'i_icon_24 i_tx_state_pending'}></div>
                            </div>
                        );
                    })}

                    {recentTransactionContext?.recentTransactions.map((tx, key) => {
                        return (
                            <div className={'f_r_b_t c_p_12 bg_tag_hover r_12'} key={key}>
                                <TransactionItem chainId={web3Context?.chainId} tx={tx} />
                                <div className={`i_icon_24 ${tx?.stateIcon}`}></div>
                            </div>
                        );
                    })}
                </ConditionDisplay>
            </div>
        </div>
    );
};




export const AccountDetail = ({className = '', onClose}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const connectorName = web3Context?.connectorName;
    const isAAWallet = checkSocialWallet(connectorName);

    const chainId = web3Context?.chainId || DefaultChain.chainId;
    const queryParams = {chainId};
    const etherBalance = useEtherBalance(web3Context.account, queryParams);
    const ethAmount = useMemo(() => {
        if(etherBalance){
            return new TokenAmount(etherBalance, getToken('ETH'));
        }

        return new TokenAmount(0, getToken('ETH'));
    }, [etherBalance]);

    const [showTokenBalances, setShowTokenBalances] = useState(false);
    const onShowTokenBalances = () => {
        setShowTokenBalances(true);
        onClose && onClose();
    };




    const [showTransactions, setShowTransactions] = useState(false);

    return (
        <>
            <ConditionDisplay display={!showTransactions}>
                <div className={`f_c_l default_container_p_s ${className}`}>
                    <AccountAddress isAAWallet={isAAWallet} onDisconnect={onClose}/>



                    <div className={'f_r_b_t m_t_15'}>
                        <div className={'f_c_l'}>
                            <div className={'f_14 c_t'}>{intl.get(`commons.component.account.pop.balance`)}</div>
                            <div className={'f_18 m_t_5 b c_high_light'}>{`${ethAmount.amount.formativeValue} ETH`}</div>
                        </div>

                        <div className={'f_r_l cp'} onClick={onShowTokenBalances}>
                            <div className={'c_link'}>{`All balances`}</div>
                            <div className={'m_l_3 i_icon_24 i_arrow_right_blue'}></div>
                        </div>
                        <TokenBalancesDialog isOpen={showTokenBalances} onClose={() => {setShowTokenBalances(false)}}/>
                    </div>

                    <div className={'f_r_b c_p_12 bg_container r_12 m_t_15 cp'} onClick={()=>setShowTransactions(true)}>
                        <div className={'f_r_l'}>
                            <div className={'i_icon_24 i_bulleted_list'}></div>
                            <div className={'m_l_10 f_16'}>{`Transactions`}</div>
                        </div>

                        <div className={'i_icon_24 i_arrow_right_gray'}></div>
                    </div>
                </div>
            </ConditionDisplay>


            <ConditionDisplay display={showTransactions}>
                <Transactions className={className} onClose={()=>setShowTransactions(false)}/>
            </ConditionDisplay>
        </>
    );
};

export const WalletConnect = ({size = 'large'}) => {
    const { deactivate, error, switchNetwork } = useEthers();
    const web3Context = useContext(WebThreeContext);
    const [isOpenSwitchNetwork, setOpenSwitchNetwork] = useState(false);
    const [isOpenNoProvider, setOpenNoProvider] = useState(false);
    const [isOpenAccount, setOpenAccount] = useState(false);

    const [isBalanceLow, setBalanceLow] = useState(false);
    const chainId = web3Context?.chainId || DefaultChain.chainId;
    const queryParams = {chainId};
    const etherBalance = useEtherBalance(web3Context.account, queryParams);
    const ethAmount = useMemo(() => {
        if(etherBalance){
            return new TokenAmount(etherBalance, getToken('ETH'));
        }

        return new TokenAmount(0, getToken('ETH'));
    }, [etherBalance]);
    useEffect(() => {
        let balanceThresholdNb = new BigNumber(ApplicationConfig.defaultETHBalanceThreshold);
        let isLow = ethAmount.amountOnChain.bigNumber.lt(balanceThresholdNb);
        // console.debug(
        //     `check current balance:`,
        //     `ethAmount =>`, ethAmount,
        //     `ethAmountNb =>`, ethAmount.amountOnChain.bigNumber.toFixed(),
        //     `balanceThresholdNb =>`, balanceThresholdNb.toFixed(),
        //     `isLow =>`, isLow,
        // );
        setBalanceLow(isLow);
    }, [ethAmount]);


    const handleOpenChange = (show) => {
        setOpenAccount(show);
    };
    const onAccountPopupClose = () => {
        handleOpenChange(false);
    };

    const walletIcon = useMemo(() => {
        if(web3Context.account){
            let walletName = web3Context?.connectorName || window.localStorage.getItem('CURRENT_WALLET_NAME') || 'injected';
            let wallet = getWalletByName(walletName);
            return wallet.icon;
        }

        return WalletMap.injected.icon;
    }, [web3Context]);

    const onSwitchNetwrok = async () => {
        let chainId = ApplicationConfig.defaultChain.chainId;
        await switchNetwork(chainId);
        setOpenSwitchNetwork(false);
    };

    const handleError = (e) => {
        console.error(`network error: error => ${e}, message => ${e?.message}`);

        if (e && e.message.includes('Not configured chain id')) {
            setOpenSwitchNetwork(true);
        } else if (e && e.message === 'No injected provider available') {
            setOpenNoProvider(true);
        }
    };

    useEffect(() => {
        if (error) {
            handleError(error);
        }
    }, [error]);



    return (
        <div className="f_r_l wallet_connect_btn_box">
            <div className="">
                <ConditionDisplay display={web3Context.account}>
                    <Popover
                        content={<AccountDetail className={'account_view_pop_content'} onClose={onAccountPopupClose}/>}
                        trigger="click"
                        open={isOpenAccount}
                        onOpenChange={handleOpenChange}
                        overlayClassName={'overlay_container account_view_pop'}
                        arrow={false}
                        placement={size === 'small' ? 'bottom' : 'bottomRight'}
                    >
                        <div className={'f_r_l c default_container_p account_network_box'}>
                            <div className={'f_r_l account_address_wrapper'}>
                                <div className={'f_r_l account_box cp'}>
                                    <div className={'account_photo'}>
                                        {/* <Jazzicon diameter={24} seed={jsNumberForAddress(web3Context.account)} /> */}
                                        <div className={`i_icon_24 ${walletIcon}`}></div>
                                    </div>
                                    <div className={'f_c_l m_l_10 account'}>
                                        <div className={'b add'}>{size === 'small' ? web3Context.summaryAccountS : web3Context.summaryAccount}</div>
                                        <div className={`f_r_l f_12`}>
                                            <div className={`c_mark`}>{`Bal: ${ethAmount.amount.formativeValue} ETH`}</div>
                                            <ConditionDisplay display={isBalanceLow}>
                                                <div className={`r_6 m_l_3 low_tips_tag`}>{`Low`}</div>
                                            </ConditionDisplay>
                                        </div>

                                        {/* <LoadTransactionStatusTips /> */}
                                    </div>

                                    <div className={'m_l_5 i_icon_24 i_arrow_down'}></div>
                                </div>
                            </div>
                        </div>
                    </Popover>
                </ConditionDisplay>
            </div>

            <ConditionDisplay display={!web3Context.account}>
                <ConnectWalletBtnAdapter size={size} />
            </ConditionDisplay>

            <ChangeNetworkDialog
                web3Context={web3Context}
                isOpen={isOpenSwitchNetwork}
                account={web3Context.account}
                onSwitchNetwrok={onSwitchNetwrok}
                onClose={() => setOpenSwitchNetwork(false)}
            />
            <NoProviderDialog isOpen={isOpenNoProvider} onClose={() => setOpenNoProvider(false)} />
        </div>
    );
};
