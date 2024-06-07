import './index.scss';

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Pagenotfound = ({
    desc = 'We seem to have run into a bit of a problem with this page',
    btnText = 'Go to homepage',
    btnAction = '/',
}) => {
    const navigate = useNavigate();
    return (
        <div className="f_c_c_c page_404">
            <div className="m_t_24 f_c_c_c">
                <div className="h3 cg_6  error_desc">{desc}</div>
                <div onClick={() => navigate(btnAction)} className="m_t_30 r_12 cp back_btn">
                    {btnText}
                </div>
            </div>
        </div>
    );
};

export default Pagenotfound;
