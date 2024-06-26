import React from 'react';
import { Button, Tooltip as ToolTip } from 'antd';
import './index.scss';
const text = <div className="">prompt text</div>;

const renderTooltipOverlay = (items, type, hasSeparator, separetorOffset) => {
    if (type === 'pool') {
        return (
            <>
                <div>
                    <span className="tooltip_text_left">{items[0].title}</span>
                    <span className="tooltip_text_right">{items[0].value}</span>
                </div>
                <div className="tooltip_content">
                    <div
                        className="i_connector_light i_icon_24 "
                        style={{ width: '5px', height: '22px', marginRight: '2px' }}
                    />
                    <div>
                        <div>
                            <span className="tooltip_text_left">{items[1].title}</span>
                            <span className="tooltip_text_right">{items[1].value}</span>
                        </div>
                        <div>
                            <span className="tooltip_text_left">{items[2].title}</span>
                            <span className="tooltip_text_right">{items[2].value}</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    return (
        <>
            {items.map((item, index) => (
                <div key={`${index}-${item.value}`}>
                    <div>
                        <span className="tooltip_text_left">{item.title}</span>
                        <span className="tooltip_text_right">{item.value}</span>
                    </div>
                    {hasSeparator && (index + 1) % separetorOffset === 0 && items.length !== index + 1 ? (
                        <div className="dashed-divider" />
                    ) : null}
                </div>
            ))}
        </>
    );
};

const CustomTooltip = ({
    children,
    type = 'default',
    overlay = text,
    hasSeparator = false,
    separetorOffset = 1,
    items,
    ...otherProps
}) => {
    return (
        <ToolTip
            placement="bottom"
            overlay={
                <div className="tooltip_popup_wrapper">
                    {items ? renderTooltipOverlay(items, type, hasSeparator, separetorOffset) : overlay}
                </div>
            }
            overlayInnerStyle={{
                padding: 0,
                background: 'transparent',
                boxShadow: 'none',
                minWidth: 170,
            }}
            showArrow={false}
            mouseEnterDelay={0.3}
            mouseLeaveDelay={0.3}
            {...otherProps}
        >
            {children}
        </ToolTip>
    );
};
export default CustomTooltip;
