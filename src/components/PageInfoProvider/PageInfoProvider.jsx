import React, { useMemo, useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PageInfoContext from './PageInfoContext';
import {cacheReferredCode} from "../../hooks/usdUserInfo";

const defaultPageInfo = {
    title: 'Drake',
    description:
        'Drake',
    nav: 'Home',
};

const reducer = (state, action) => {
    console.debug(`set page info...`);
    return state.nav === action.nav ? state : action;
};

const PageInfoProvider = (props) => {
    const [pageInfo, dispatch] = useState(defaultPageInfo);

    const contextWrapper = useMemo(
        () => ({
            pageInfo: pageInfo,
            dispatch: dispatch,
        }),
        [pageInfo],
    );

    useEffect(() => {
        cacheReferredCode();
    }, []);

    return (
        <PageInfoContext.Provider value={contextWrapper}>
            <HelmetProvider>
                <Helmet>
                    <title>{pageInfo.title}</title>
                    <meta name="description" content={pageInfo.description} />
                </Helmet>
            </HelmetProvider>

            {props.children}
        </PageInfoContext.Provider>
    );
};

export default PageInfoProvider;
