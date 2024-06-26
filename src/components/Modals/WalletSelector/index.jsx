import './index.scss';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import ApplicationConfig from '../../../ApplicationConfig';
import { WalletConfig } from './WalletConfig';
import { useEthers } from '@usedapp/core';
import WebThreeContext from '../../WebThreeProvider/WebThreeContext';
import {useIntl} from "../../i18n";

const WalletSelector = ({ isOpen, onClose }) => {
    const intl = useIntl();
    const { activateBrowserWallet, deactivate } = useEthers();
    const web3Context = useContext(WebThreeContext);

    const [isCheckboxChecked, checkboxChecked] = useState(true);
    const [hoverWallet, setHoverWallet] = useState('injected');
    const [lastWallet, setLastWallet] = useState('injected');

    const enableWallets = useMemo(() => {
        let wallets = WalletConfig.filter((config) => {
            if (config.enable) {
                return config.enable();
            }

            return true;
        });
        return wallets;
    }, [window.ethereum, window.okxwallet]);

    const checkTxtClick = (event) => {
        event.stopPropagation();
    };

    const onHover = (connector) => {};

    const connectWallet = (connector, wallet) => {
        console.debug(`connect with `, wallet);

        if (window.localStorage) {
            window.localStorage.setItem('CURRENT_WALLET_NAME', wallet);
            window.localStorage.setItem('CURRENT_WALLET_CONNECTED', 'true');
        }

        if (connector === 'injected' && (window.ethereum || window.okxwallet)) {
            let activeWallet = wallet === 'OKX wallet' ? 'okx' : 'metamask';
            activateBrowserWallet({ type: activeWallet });
        } else {
            activateBrowserWallet({ type: 'walletConnect' });
        }
    };

    const disconnect = (event) => {
        event.stopPropagation();
        deactivate();
        if (window.localStorage) {
            window.localStorage.setItem('CURRENT_WALLET_CONNECTED', 'false');
        }
    };

    useEffect(() => {
        if (window.localStorage) {
            // let _isCheckboxChecked = window.localStorage.getItem('CONNECT_WALLET_CHECKBOX_CHECKED') === 'true';
            // checkboxChecked(_isCheckboxChecked);

            let _lastWallet = window.localStorage.getItem('CURRENT_WALLET') || 'injected';
            setLastWallet(_lastWallet);

            let _lastWalletName = window.localStorage.getItem('CURRENT_WALLET_NAME') || 'MetaMask';
            let _lastWalletDisconnected = window.localStorage.getItem('CURRENT_WALLET_CONNECTED') || 'false';
            console.debug(
                `LastConnectedWallet => `,
                _lastWalletName,
                `_lastWalletDisconnected => `,
                _lastWalletDisconnected,
            );
            if (_lastWalletName === 'OKX wallet' && _lastWalletDisconnected === 'true') {
                console.debug(`connect to okx automatically.`);
                activateBrowserWallet({ type: 'okx' });
            }
        }
    }, [window.ethereum, window.okxwallet]);

    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={ApplicationConfig.popupSmallWindowWidth}
            onCancel={onClose}
            className={'overlay_container common_modal wallet_selector'}
        >
            <div className={`pop_wallet_box ${isCheckboxChecked ? 'wallet_items_enable' : 'wallet_items_disable'}`}>
                <div className={'wallet_title'}>{intl.get(`commons.component.wallet.selector.title`)}</div>
                <div className={'f_r_l_t m_t_5 m_b_25 wallet_title_s'}>{intl.get(`commons.component.wallet.selector.title_s`)}</div>

                <div className={'w_full f_r_l gap-3'}>
                    {enableWallets.map((wallet, index) => (
                        <div
                            key={index}
                            className={`f_c_l bg_tag_hover r_12 wallet_item ${hoverWallet === wallet.name ? 'wallet_item_active' : ''}`}
                            onClick={() => {
                                connectWallet(wallet.connector, wallet.name);
                            }}
                            onMouseOver={onHover(wallet.name)}
                        >
                            <div className={'f_r_b'}>
                                <div className={`i_icon_24 ${wallet.icon}`} />
                                <div className={`i_icon_24 i_arrow_right`} />
                            </div>
                            <div className={'f_r_l'}>
                                <div className={'wallet_name'}>{wallet.name}</div>
                            </div>
                        </div>
                    ))}
                </div>


                <div className={'f_r_l_t m_t_25 wallet_title_s'}>
                    <div>
                        {`${intl.get(`commons.component.wallet.selector.terms[0]`)} `}
                        <a
                            href="#"
                            target={'_blank'}
                            className={'c_link'}
                            onClick={checkTxtClick}
                        >
                            {intl.get(`commons.component.wallet.selector.terms[1]`)}
                        </a>
                        {` ${intl.get(`commons.component.wallet.selector.terms[2]`)} `}
                        <a
                            href="#"
                            target={'_blank'}
                            className={'c_link'}
                            onClick={checkTxtClick}
                        >
                            {intl.get(`commons.component.wallet.selector.terms[3]`)}
                        </a>
                        .
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default WalletSelector;
