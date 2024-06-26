import React, {useMemo, useReducer, useState, useEffect, useContext} from 'react';
import TransactionContext from "../Transaction/TransactionContext";
import WebThreeContext from "../WebThreeProvider/WebThreeContext";
import {TransactionContextState} from "../Transaction/TransactionState";
import TransactionSenderContext from "./TransactionSenderContext";
import {checkSocialWallet} from "../Modals/WalletSelector/WalletConfig";

const TransactionSenderProvider = (props) => {
    const web3Context = useContext(WebThreeContext);
    const transactionContext = useContext(TransactionContext);

    const [txQueue, setTxQueue] = useState([]);
    const [blocked, setBlocked] = useState(false);

    const onTxQueueChange = (tx) => {
        let _txQueue = [
            tx,
            ...txQueue,
        ];
        setTxQueue(_txQueue);
    };

    const contextWrapper = useMemo(
        () => ({
            dispatch: onTxQueueChange,
        }),
        [txQueue],
    );

    useEffect(() => {
        if(!blocked && txQueue.length){
            let connectorName = web3Context?.connectorName;
            let isAAWallet = checkSocialWallet(connectorName);
            if(isAAWallet){
                setBlocked(()=>{
                    return true;
                });
            }

            let _txQueue = [
                ...txQueue
            ];
            let tx = _txQueue.pop();
            let {txSender, txContext} = tx;
            console.debug(`pop tx:`, txContext);

            txSender();

            setTxQueue(_txQueue);
        }
    }, [txQueue.length, blocked]);

    useEffect(() => {
        console.debug(`updated transactionContext => `, transactionContext);
        if (transactionContext?.transactionInfo?.state) {
            switch (transactionContext?.transactionInfo?.state) {
                case TransactionContextState.success:
                case TransactionContextState.rejected:
                case TransactionContextState.failed:
                case TransactionContextState.phased_rejected:
                case TransactionContextState.phased_failed:
                case TransactionContextState.final_rejected:
                case TransactionContextState.final_failed:
                case TransactionContextState.final_success:
                    console.debug(`unlock tx...`);
                    setBlocked(false);
                    break;
            }
        }
    }, [transactionContext]);

    return (
        <TransactionSenderContext.Provider value={contextWrapper}>
            {props.children}
        </TransactionSenderContext.Provider>
    );
};

export default TransactionSenderProvider;
