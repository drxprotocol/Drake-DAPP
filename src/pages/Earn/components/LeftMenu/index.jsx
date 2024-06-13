import './index.scss';

import React, {useContext, useEffect, useState} from 'react';
import {LEFT_MENU_ITEMS_FOR_EARN, LeftNavMenu} from "../../../../components/Navigation";

const LeftMenu = () => {
    return (
        <div className="hidden lg:block">
            <div className={'f_c_l_c es_left_menu'}>
                <LeftNavMenu leftMenuItems={LEFT_MENU_ITEMS_FOR_EARN}/>
            </div>
        </div>
    );
};

export default LeftMenu;
