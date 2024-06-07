import * as React from 'react';

import './index.scss';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Modal } from 'antd';
import ErrorIcon from './img/error.svg';
import ApplicationConfig from '../../../../../ApplicationConfig';

const NoProviderDialog = ({ isOpen, onClose }) => {
    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={ApplicationConfig.popupWindowWidth}
            onCancel={onClose}
            closable={true}
            className={'overlay_container common_modal '}
            bodyStyle={{ padding: '20px' }}
        >
            <div className={'network_change_container'}>
                <img className={'error_circle_container'} src={ErrorIcon} />
                <div className={'title'}>The Wallet package is not installed.</div>
                <div className={'footer'}>
                    <div className={'w_300'}>
                        <p
                            style={{ marginTop: '20px' }}
                        >{`You'll need to install "MetaMask" to continue. Once you have it installed, go ahead and refresh the page.`}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default NoProviderDialog;
