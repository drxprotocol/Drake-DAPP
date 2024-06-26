/**
 * @Author: DAPP
 * @Date:   2021-06-28 09:54:46
 * @Last Modified by:   DAPP
 * @Last Modified time: 2021-09-16 22:45:06
 */
import React from 'react';
import {Tooltip as ToolTip, Tooltip} from 'antd';
import {useIntl} from "../i18n";

export const ToolTipDashedLine = ({ tips, content, className='', placement='topLeft' }) => {
    return (
        <Tooltip title={tips} placement={placement}>
            <div className={`t_dashed_underline c_text ${className}`}>{content}</div>
        </Tooltip>
    );
};

export const ToolTipDashedLineForTitle = ({ tips, content, className='f_14', placement='topLeft' }) => {
    return (
        <ToolTipDashedLine tips={tips} content={content} className={className} placement={placement} />
    );
};

export const ToolTipDashedLinePopup = ({ tips, content, className='', placement='topLeft', hasMoreLink=true, moreLink='#' }) => {
    const intl = useIntl();

    return (
        <ToolTip
            placement={placement}
            overlay={
                <div className="overlay_container tooltip_popup_wrapper">
                    <span>{tips}</span>

                    {hasMoreLink && (
                        <span><a className={'c_link'} href={moreLink}>{intl.get(`commons.component.link.learn_more`)}</a></span>
                    )}
                </div>
            }
            mouseEnterDelay={0.3}
            mouseLeaveDelay={0.3}
        >
            <div className={`t_dashed_underline c_text ${className}`}>{content}</div>
        </ToolTip>
    );
};
