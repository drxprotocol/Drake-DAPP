import React, { PropsWithChildren } from 'react';
import { Tooltip } from 'antd';

declare type RenderFunction = () => React.ReactNode;
export declare type TooltipPlacement =
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';

interface Props {
    title: React.ReactNode | RenderFunction;
    position?: TooltipPlacement;
}

const e: React.FC<PropsWithChildren<Props>> = ({ title, position, children }) => {
    return (
        <Tooltip
            title={title}
            placement={position}
            key={new Date().getTime().toString()}
            overlayStyle={{ top: 10 }}
            overlayInnerStyle={{ borderRadius: 6 }}
        >
            {children ? children : null}
        </Tooltip>
    );
};

export default e;
