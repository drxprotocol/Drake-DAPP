import React from 'react';

export const ConditionRender = ({ display, children }) => {
    return (
        <div className={`f_c_l w_100 ${display ? '' : 'dn'}`}>
            {children}
        </div>
    );
};
