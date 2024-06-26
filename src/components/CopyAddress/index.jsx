/**
 * @Author: DAPP
 * @Date:   2021-06-28 09:54:46
 * @Last Modified by:   DAPP
 * @Last Modified time: 2021-09-16 22:28:45
 */
import './index.scss';

import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'antd';

function CopyAddress({ address, tips, className }) {
    const [copied, setIsCopied] = React.useState(false);

    const copy = () => {
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 3000);
    };

    return copied ? (
        <div className={`copy_address_box ${className}`}>
            {tips ? (
                <Tooltip title="Copied!">
                    <div className={'ca_icon'}></div>
                </Tooltip>
            ) : (
                <>
                    <div className={'ca_icon'}></div>
                    <div className={'ca_txt'}>Copied!</div>
                </>
            )}
        </div>
    ) : (
        <CopyToClipboard text={address || ''} onCopy={copy}>
            <div className={`copy_address_box ${className}`}>
                <div className={'ca_icon'}></div>
                {!tips && <div className={'ca_txt'}>Copy address</div>}
            </div>
        </CopyToClipboard>
    );
}

export default CopyAddress;
