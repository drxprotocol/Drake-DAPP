import React from 'react';
import {ConnectWalletBtn} from '../ConnectWalletBtn';

const NoConnectWallet: React.FC = () => {
    return (
        <div className="items-center justify-center m-auto flex flex-col py-9 bg-bg-gray rounded-2xl w-full">
            <div className="f_18 b">{'Wallet is not connected'}</div>
            <ConnectWalletBtn className="i_btn sub_btn_primary sub_btn_long_blue m_t_12 connect_wallet_btn_large" />
        </div>
    );
};

export default NoConnectWallet;
