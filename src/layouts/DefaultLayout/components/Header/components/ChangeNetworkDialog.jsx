import * as React from 'react';

import './index.scss';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Modal } from 'antd';
import ErrorIcon from './img/error.svg';
import ApplicationConfig from '../../../../../ApplicationConfig';
import { DefaultChain } from '../../../../../contract/ChainConfig';

const ChangeNetworkDialog = ({ isOpen, onClose, account, onSwitchNetwrok, web3Context }) => {
    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={ApplicationConfig.popupSmallWindowWidth}
            onCancel={onClose}
            closable={true}
            className={'overlay_container common_modal '}
            bodyStyle={{ padding: '20px' }}
        >
            <div className={'w_100 f_c_l network_change_container'}>
                <div className={'title b'}>Unsupported network</div>

                <div className={'user_info_container'}>
                    <div className={'f_r_l account_address_wrapper'}>
                        {/* <div className={'f_r_l account_photo'}>
                            <Jazzicon diameter={24} seed={jsNumberForAddress(account)} />
                        </div> */}

                        <div className={'i_icon_24 i_metamask_1'}></div>
                        <div className={'f_r_l account'}>
                            <div className={'add'}>{web3Context?.summaryAccount}</div>
                        </div>
                        <div className={'f_r_l r_90 network_box'}>
                            <div className={'dot'} />
                            <div>{`${'Unsupported chain'}`}</div>
                        </div>
                    </div>
                </div>

                <div className={'f_c_l footer'}>
                    <div>{`We've detected that you need to switch your wallet's network to ${DefaultChain.chainName} for this DApp.`}</div>
                    <div
                        className={'cp r_8 switch_btn text_center'}
                        onClick={onSwitchNetwrok}
                    >{`Switch to ${DefaultChain.chainName}`}</div>
                </div>
            </div>
        </Modal>
    );
};
export default ChangeNetworkDialog;
