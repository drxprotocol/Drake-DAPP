import './index.scss';

import React from "react";
import {useIntl} from "../../../../../components/i18n";

export const BlockTipsBar = () => {
    const intl = useIntl();

    return (
        <div className={'block_tips_bar'}>
            {intl.get(`page.block.tips_message`)}
        </div>
    );
};