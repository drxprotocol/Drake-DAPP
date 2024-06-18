import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layouts';
import HomeV3 from './pages/HomeV3/Home';
import Error404 from './pages/error404/Error404';
import {Earn} from "./pages/Earn/Earn";
import {EarnOverView} from "./pages/Earn/EarnOverView";
import {FundingRate} from "./pages/Earn/FundingRate";
import ApplicationConfig from "./ApplicationConfig";
import {DAPPLayout} from "./layouts/DefaultLayout/DAPPLayout";
import {NoWalletLayout} from "./layouts/DefaultLayout/NoWalletLayout";

const DefaultRouterConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/earn" element={<DAPPLayout MainContentComponent={Earn}/>}/>
                <Route path="/earn/overview" element={<DAPPLayout MainContentComponent={EarnOverView}/>}/>
                <Route path="/funding_rate_vault" element={<DAPPLayout MainContentComponent={FundingRate}/>}/>
                <Route path="/home" element={<NoWalletLayout MainContentComponent={HomeV3} layout={'Landing'} />} />
                <Route path="/" element={<NoWalletLayout MainContentComponent={HomeV3} layout={'Landing'} />} exact />
                <Route path="*" element={<NoWalletLayout MainContentComponent={Error404} />} />
            </Routes>
        </Router>
    );
};

const ComingSoonRouterConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/earn" element={<NoWalletLayout MainContentComponent={HomeV3} layout={'Landing'}/>}/>
                <Route path="/earn/overview" element={<NoWalletLayout MainContentComponent={HomeV3} layout={'Landing'}/>}/>
                <Route path="/trade" element={<NoWalletLayout MainContentComponent={HomeV3} layout={'Landing'} />} />
                <Route path="/home" element={<NoWalletLayout MainContentComponent={HomeV3} layout={'Landing'} />} />
                <Route path="/" element={<NoWalletLayout MainContentComponent={HomeV3} layout={'Landing'} />} exact />
                <Route path="*" element={<NoWalletLayout MainContentComponent={Error404} />} />
            </Routes>
        </Router>
    );
};

const RouterConfig = () => {
    return ApplicationConfig.comingSoon ? <ComingSoonRouterConfig/> : <DefaultRouterConfig/>;
};

export default RouterConfig;
