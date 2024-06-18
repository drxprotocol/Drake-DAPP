import React, { useMemo, useEffect, useState } from 'react';
import Header from './components/Header';
import NewFooter from './components/NewFooter';

import '../../assets/css/tailwind.css';

import './index.scss';
import './theme_light.scss';
import '../../components/Icons/index.scss';
import '../../components/Coin/index.scss';
import '../../components/DAPPForm/index.scss';

import PageInfoProvider from '../../components/PageInfoProvider/PageInfoProvider';
import {I18nProvider, initializeDefaultLanguage} from "../../components/i18n";
import {checkBlockedRegion} from "../../utils/RegionUtil";
import {BlockTipsBar} from "./components/Header/components/BlockTipsBar";
import TopNotificationTipsProvider from "../../components/TopNotificationTipsProvider/TopNotificationTipsProvider";


export const NoWalletLayout = ({ MainContentComponent, layout }) => {
    const currentPath = window.location.pathname;
    const [blockCurrentRegionChecked, setBlockCurrentRegionChecked] = useState(true);
    useEffect(() => {
        setBlockCurrentRegionChecked(() => {
            return true;
        });

        // check region
        let enableRegionBlockerEnv = import.meta.env.VITE_ENABLE_REGION_BLOCKER;
        console.debug(`enableRegionBlockerEnv =>`, enableRegionBlockerEnv);
        if (enableRegionBlockerEnv !== 'false') {
            checkBlockedRegion((checked) => {
                setBlockCurrentRegionChecked(checked);
            });
        } else {
            setBlockCurrentRegionChecked(true);
        }
    }, [currentPath]);

    return (
        <PageInfoProvider>
            <I18nProvider>
                <div className="main_container">
                    <TopNotificationTipsProvider>
                        {!blockCurrentRegionChecked && (
                            <BlockTipsBar/>
                        )}

                        <Header layout={layout}/>
                        <MainContentComponent/>
                        <NewFooter layout={layout}/>
                    </TopNotificationTipsProvider>
                </div>
            </I18nProvider>
        </PageInfoProvider>
    );
};