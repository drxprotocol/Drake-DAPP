/**
 * @Author: DAPP
 * @Date:   2021-06-28 09:54:46
 * @Last Modified by:   DAPP
 * @Last Modified time: 2021-09-16 22:45:06
 */
import React from 'react';
import Tooltip from '../Tooltip';

function ToolTipIcon({ tips, className }) {
    return (
        <Tooltip title={tips}>
            <span className={`inline-block i_icon_24 i_info_circle m_l_4 ${className || ''}`}></span>
        </Tooltip>
    );
}

export default ToolTipIcon;
