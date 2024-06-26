/**
 * @Author: DAPP
 * @Date:   2021-06-28 09:54:46
 * @Last Modified by:   DAPP
 * @Last Modified time: 2021-09-16 22:45:06
 */
import './index.scss';
import React from 'react';
import Tooltip from '../Tooltip';

function ViewOnEtherscan({ url, showTitle, toolTips, className }) {
    return (
        <a href={url || '#'} target={'_blank'} className={`view_on_etherscan_box ${className}`} rel="noreferrer">
            {toolTips ? (
                <Tooltip title={toolTips}>
                    <div className={'voe_icon'}></div>
                </Tooltip>
            ) : (
                <div className={'voe_icon'}></div>
            )}

            {showTitle && <span className={'voe_txt'}>View on Explorer</span>}
        </a>
    );
}

export default ViewOnEtherscan;
