import React, {useMemo, useReducer, useState, useEffect, useContext} from 'react';
import RecentTransactionContext from './RecentTransactionContext';
import TransactionContext from "../Transaction/TransactionContext";
import {getLocalStorage, saveToLocalStorage} from "../../utils/LocalStorage";
import WebThreeContext from "../WebThreeProvider/WebThreeContext";
import NotificationContext from "../NotificationProvider/NotificationContext";
import CopyAddress from "../CopyAddress";
import ViewOnEtherscan from "../ViewOnEtherscan";
import ContractConfig from "../../contract/ContractConfig";
import {TransactionContextState} from "../Transaction/TransactionState";
import {NotificationState} from "../NotificationProvider/NotificationState";
import {fetchOrderHistoryEventFromSubgraph} from "../../hooks/useTrdingMeta";

const convertTransactionInfo = (transactionInfo) => {
    let stateIcon = '';
    switch (transactionInfo?.state) {
        case TransactionContextState.confirm:
        case TransactionContextState.pending:
        case TransactionContextState.phased_confirm:
        case TransactionContextState.phased_pending:
        case TransactionContextState.phased_success:
        case TransactionContextState.final_pending:
            stateIcon = 'i_tx_state_pending';
            break;
        case TransactionContextState.success:
        case TransactionContextState.final_success:
            stateIcon = 'i_tx_state_success';
            break;
        case TransactionContextState.rejected:
        case TransactionContextState.failed:
        case TransactionContextState.phased_rejected:
        case TransactionContextState.phased_failed:
        case TransactionContextState.final_rejected:
        case TransactionContextState.final_failed:
            stateIcon = 'i_tx_state_failed';
            break;
        default:
            stateIcon = '';
    }

    let transaction = {
        state: transactionInfo?.state,
        stateIcon: stateIcon,
        content: transactionInfo?.content,
        txType: transactionInfo?.txType,
        hash: transactionInfo?.hash,
        timestamp: transactionInfo?.timestamp,
        sharedData: transactionInfo?.sharedData,
        chainId: transactionInfo?.chainId,
    };

    return transaction;
};

const MAX_PENDING_TRANSACTIONS_LENGTH = 10;
const MAX_RECENT_TRANSACTIONS_LENGTH = 10;
export const RECENT_TRANSACTIONS_CACHE_KEY = 'RECENT_TRANSACTIONS';

const pushToTransactionsList = (transaction, transactions, maxLength) => {
    let exist = false;
    let _transaction = convertTransactionInfo(transaction);

    let txs = transactions.map(tx => {
        if(tx?.timestamp === _transaction?.timestamp) {
            exist = true;
            return _transaction;
        }

        return tx;
    });

    if(!exist){
        txs.unshift(_transaction);
    }

    if(txs.length > maxLength){
        txs.pop();
    }

    return txs;
};

const removeTransaction = (transaction, transactions) => {
    let _transaction = convertTransactionInfo(transaction);

    let txs = transactions.filter(tx => {
        return tx?.timestamp !== _transaction?.timestamp;
    });
    return txs;
};


const buildTransactionNotificaitonOperations = (chainId, transactionInfo) => {
    return transactionInfo?.hash ? (
        <div className={`f_r_l m_l_3`}>
            <CopyAddress address={transactionInfo?.hash} tips={true} />
            <ViewOnEtherscan
                url={`${ContractConfig.etherscan(chainId)}/tx/${transactionInfo?.hash}`}
            />
        </div>
    ) : <div></div>;
};

const buildTransactionNotification = (chainId, transactionInfo) => {
    let notificationState = '';
    switch (transactionInfo?.state) {
        case TransactionContextState.confirm:
        case TransactionContextState.pending:
        case TransactionContextState.phased_confirm:
        case TransactionContextState.phased_pending:
        case TransactionContextState.phased_success:
        case TransactionContextState.final_pending:
            notificationState = NotificationState.pending;
            break;
        case TransactionContextState.success:
        case TransactionContextState.final_success:
            notificationState = NotificationState.success;
            break;
        case TransactionContextState.rejected:
        case TransactionContextState.phased_rejected:
        case TransactionContextState.final_rejected:
            notificationState = NotificationState.warning;
            break;
        case TransactionContextState.failed:
        case TransactionContextState.phased_failed:
        case TransactionContextState.final_failed:
            notificationState = NotificationState.failed;
            break;
        default:
            notificationState = '';
    }


    let title = '';
    switch (transactionInfo?.state) {
        case TransactionContextState.confirm:
        case TransactionContextState.pending:
            title = 'Processing...';
            break;
        case TransactionContextState.success:
            title = 'Successful!!!';
            break;
        case TransactionContextState.rejected:
            title = 'Rejected!!!';
            break;
        case TransactionContextState.failed:
            title = 'Failed!!!';
            break;
        case TransactionContextState.phased_confirm:
        case TransactionContextState.phased_pending:
            title = 'Submitting...';
            break;
        case TransactionContextState.phased_success:
            title = 'Submitted...';
            break;
        case TransactionContextState.phased_rejected:
            title = 'Submit Rejected!!!';
            break;
        case TransactionContextState.phased_failed:
            title = 'Submit Failed!!!';
            break;
        case TransactionContextState.final_pending:
            title = 'Processing...';
            break;
        case TransactionContextState.final_success:
            title = 'Successful!!!';
            break;
        case TransactionContextState.final_rejected:
            title = 'Rejected!!!';
            break;
        case TransactionContextState.final_failed:
            title = 'Failed!!!';
            break;
        default:
            title = '';
    }

    let operations = buildTransactionNotificaitonOperations(chainId, transactionInfo);

    let transactionNotification = {
        id: transactionInfo?.timestamp,
        state: notificationState,
        title: title,
        content: transactionInfo?.content,
        operations: operations,
        sharedData: transactionInfo?.sharedData,
    };

    // console.debug(`transactionNotification =>`, transactionNotification);

    return transactionNotification;
};


const recheckTxState = (recentTransactions, recentTransactionsUpdater) => {
    let needToRecheckTxs = recentTransactions.map((transaction, index) => {
        if(transaction?.state === TransactionContextState.final_failed && transaction?.hash){
            let chainId = transaction?.chainId;
            let {portfolioAddress, reqIdentifier} = transaction?.sharedData || {};
            if(chainId && portfolioAddress && reqIdentifier){
                return {
                    key: index,
                    query: {chainId, portfolioAddress, reqIdentifier, first: 1},
                    transaction,
                };
            }
        }

        return null;
    }).filter(tx => {
        return tx;
    }) || [];

    if(needToRecheckTxs.length){
        let recheckResults = [];

        let onFetched = () => {
            let _recentTransactions = recentTransactions.map((transaction, index) => {
                let recheckResult = recheckResults.find(result => {
                    return result.recheck.key === index && result.checked;
                });

                return recheckResult ? recheckResult.updatedTx : transaction;
            });

            recentTransactionsUpdater && recentTransactionsUpdater(_recentTransactions);
        };

        needToRecheckTxs.forEach((recheck, index) => {
            fetchOrderHistoryEventFromSubgraph(recheck.query).then(events => {
                if(events.length){
                    console.debug(`reset tx state to`, TransactionContextState.final_success);

                    let _tx = convertTransactionInfo({
                        ...recheck.transaction,
                        state: TransactionContextState.final_success,
                    });

                    recheckResults.push({
                        recheck: recheck,
                        checked: true,
                        updatedTx: _tx,
                    });
                } else {
                    recheckResults.push({
                        recheck: recheck,
                        checked: false,
                    });
                }

                if(recheckResults.length === needToRecheckTxs.length){
                    onFetched();
                }
            }).catch(e => {
                console.error(e);

                recheckResults.push({
                    recheck: recheck,
                    checked: false,
                });

                if(recheckResults.length === needToRecheckTxs.length){
                    onFetched();
                }
            });
        });
    } else {
        recentTransactionsUpdater && recentTransactionsUpdater(recentTransactions);
    }
};

const RecentTransactionProvider = (props) => {
    const web3Context = useContext(WebThreeContext);
    const transactionContext = useContext(TransactionContext);
    const notificationContext = useContext(NotificationContext);

    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);


    const saveRecentTransactions = (txs) => {
        setRecentTransactions(txs);
        saveToLocalStorage(`${RECENT_TRANSACTIONS_CACHE_KEY}_${web3Context?.account}_${web3Context?.chainId}`, txs);
    };

    const onLoadRecentTransactions = () => {
        let _recentTransactions = getLocalStorage(`${RECENT_TRANSACTIONS_CACHE_KEY}_${web3Context?.account}_${web3Context?.chainId}`) || [];
        recheckTxState(_recentTransactions, saveRecentTransactions);
    };

    useEffect(() => {
        onLoadRecentTransactions();
    }, [web3Context]);


    const onRecentTransactionChange = (pending, recent, reload) => {
        if(pending) {
            setPendingTransactions(pending);
        }

        if(recent) {
            setRecentTransactions(recent);
        }

        if(reload) {
            onLoadRecentTransactions();
        }
    };

    const contextWrapper = useMemo(
        () => ({
            pendingTransactions: pendingTransactions,
            recentTransactions: recentTransactions,
            dispatch: onRecentTransactionChange,
        }),
        [pendingTransactions, recentTransactions],
    );



    useEffect(() => {
        // console.debug(`transactionContext => `, transactionContext);
        if (transactionContext?.transactionInfo?.state) {
            switch (transactionContext?.transactionInfo?.state) {
                case TransactionContextState.confirm:
                case TransactionContextState.pending:
                case TransactionContextState.phased_confirm:
                case TransactionContextState.phased_pending:
                case TransactionContextState.phased_success:
                case TransactionContextState.final_pending:
                    setPendingTransactions(pushToTransactionsList(transactionContext?.transactionInfo, pendingTransactions, MAX_PENDING_TRANSACTIONS_LENGTH));
                    break;
                case TransactionContextState.rejected:
                case TransactionContextState.failed:
                case TransactionContextState.phased_rejected:
                case TransactionContextState.phased_failed:
                case TransactionContextState.final_rejected:
                case TransactionContextState.final_failed:
                case TransactionContextState.success:
                case TransactionContextState.final_success:
                    saveRecentTransactions(pushToTransactionsList(transactionContext?.transactionInfo, recentTransactions, MAX_RECENT_TRANSACTIONS_LENGTH));
                    setPendingTransactions(removeTransaction(transactionContext?.transactionInfo, pendingTransactions));
                    break;
            }


            let transactionNotification = buildTransactionNotification(web3Context?.chainId, transactionContext?.transactionInfo);
            notificationContext.dispatch(transactionNotification);
        }
    }, [transactionContext]);

    return (
        <RecentTransactionContext.Provider value={contextWrapper}>
            {props.children}
        </RecentTransactionContext.Provider>
    );
};

export default RecentTransactionProvider;
