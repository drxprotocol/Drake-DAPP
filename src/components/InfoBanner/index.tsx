import { useSessionStorage } from 'hooks/useSessionStorage';
import React from 'react';
const InfoBanner = ({
    title = 'This is only for Farm Admins',
    bannerKey = 'farm_admin_info',
    className = '',
    ...otherProps
}) => {
    const [isShow, setShow] = useSessionStorage(bannerKey, true);
    return isShow ? (
        <div className={`flex flex-row bg_blue_3 r_12 justify-between py-2 px-3 ${className}`} {...otherProps}>
            <div className="flex flex-row items-center">
                <div className="i_icon_24 i_info_circle_blue mr-3" />
                <div className="text-dark-blue font-smedium">{title}</div>
            </div>

            <div className="i_icon_24 i_close_blue cursor-pointer" onClick={() => setShow(false)} />
        </div>
    ) : null;
};

export default InfoBanner;
