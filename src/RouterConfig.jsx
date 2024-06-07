import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layouts';
import HomeV3 from './pages/HomeV3/Home';
import Error404 from './pages/error404/Error404';
import {AALayout} from "./layouts/DefaultLayout/AALayout";
import ApplicationConfig from "./ApplicationConfig";

const DefaultRouterConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<DefaultLayout MainContentComponent={HomeV3} layout={'Landing'} />} />
                <Route path="/" element={<DefaultLayout MainContentComponent={HomeV3} layout={'Landing'} />} exact />
                <Route path="*" element={<AALayout MainContentComponent={Error404} />} />
            </Routes>
        </Router>
    );
};

const ComingSoonRouterConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/earn" element={<AALayout MainContentComponent={HomeV3} layout={'Landing'}/>}/>
                <Route path="/earn/overview" element={<AALayout MainContentComponent={HomeV3} layout={'Landing'}/>}/>
                <Route path="/home" element={<DefaultLayout MainContentComponent={HomeV3} layout={'Landing'} />} />
                <Route path="/" element={<DefaultLayout MainContentComponent={HomeV3} layout={'Landing'} />} exact />
                <Route path="*" element={<AALayout MainContentComponent={Error404} />} />
            </Routes>
        </Router>
    );
};

const RouterConfig = () => {
    return ApplicationConfig.comingSoon ? <ComingSoonRouterConfig/> : <DefaultRouterConfig/>;
};

export default RouterConfig;
