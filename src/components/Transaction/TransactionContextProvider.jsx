import React, {useMemo, useReducer, useState, useEffect, useContext} from 'react';
import TransactionContext from './TransactionContext';
import { TransactionDialogBox } from './TransactionDialogBox';
import WebThreeContext from "../WebThreeProvider/WebThreeContext";
import {checkSocialWallet} from "../Modals/WalletSelector/WalletConfig";
import {convertTransactionStateToContextState, TransactionContextState, TransactionState} from "./TransactionState";
import ApplicationConfig from "../../ApplicationConfig";

const popupTransactionDialogBoxForStatesEOA = [
    TransactionContextState.confirm,
    TransactionContextState.phased_confirm,
];
const popupTransactionDialogBoxForStatesAA = [];

const defaultTransactionInfo = {
    state: '', // transaction state: [confirm|pending|success|failed|rejected]
    content: '',
    hash: '',
    onSuccess: () => {},
};

const convertTransactionStateToTransactionInfo = (state) => {
    let transactionInfo = {};

    let txContent = state?.txContent || '';
    let sharedData = state?.sharedData || {};
    let chainId = state?.chainId || ApplicationConfig.defaultChain.id;
    let txType = state?.txType || '';
    let msg = state?.errorMessage || '';
    let txSate = convertTransactionStateToContextState(state?.status, msg);
    let timestamp = state?.timestamp || new Date().getTime();

    switch (state?.status) {
        case TransactionState.PendingSignature:
        case TransactionState.Submit:
        case TransactionState.Phased_PendingSignature:
        case TransactionState.Phased_Submit:
            transactionInfo = {
                state: txSate,
                content: txContent,
                txType: txType,
                timestamp: timestamp,
                sharedData: sharedData,
                chainId: chainId,
            };
            break;
        case TransactionState.Phased:
        case TransactionState.Mining:
        case TransactionState.Phased_Mining:
        case TransactionState.Final_Mining:
            transactionInfo = {
                state: txSate,
                content: txContent,
                txType: txType,
                hash: state?.transaction?.hash || '',
                timestamp: timestamp,
                sharedData: sharedData,
                chainId: chainId,
            };
            break;
        case TransactionState.Success:
        case TransactionState.Phased_Success:
        case TransactionState.Final_Success:
            transactionInfo = {
                state: txSate,
                content: txContent,
                txType: txType,
                hash: state?.transaction?.hash || '',
                timestamp: timestamp,
                onSuccess: state?.onSuccess,
                sharedData: sharedData,
                chainId: chainId,
            };
            break;
        case TransactionState.Exception:
        case TransactionState.Phased_Exception:
        case TransactionState.Final_Exception:
            transactionInfo = {
                state: txSate,
                errorMessage: msg,
                content: txContent,
                txType: txType,
                hash: state?.transaction?.hash || '',
                timestamp: timestamp,
                sharedData: sharedData,
                chainId: chainId,
            };
            break;
        default:
            transactionInfo = {
                state: '',
                content: '',
                txType: '',
                hash: '',
                timestamp: timestamp,
                sharedData: sharedData,
                chainId: chainId,
            };
    }

    return transactionInfo;
};

const reducer = (state, action) => {
    // console.debug(`transaction state =>`, state, action);
    let transactionInfo = convertTransactionStateToTransactionInfo(action);
    return (state.state === transactionInfo.state && state.timestamp === transactionInfo.timestamp) ? state : transactionInfo;
};

const TransactionContextProvider = (props) => {
    const web3Context = useContext(WebThreeContext);

    const [transactionInfo, dispatch] = useReducer(reducer, defaultTransactionInfo);
    const [openTransactionModal, setOpenTransactionModal] = useState(false);

    const contextWrapper = useMemo(
        () => ({
            transactionInfo: transactionInfo,
            dispatch: dispatch,
        }),
        [transactionInfo],
    );

    useEffect(() => {
        if (transactionInfo.state) {
            // console.debug(`transactionInfo =>`, transactionInfo);

            let connectorName = web3Context?.connectorName;
            let isAAWallet = checkSocialWallet(connectorName);
            let popupTransactionDialogBoxForStates = isAAWallet ? popupTransactionDialogBoxForStatesAA : popupTransactionDialogBoxForStatesEOA;
            if (popupTransactionDialogBoxForStates.includes(transactionInfo.state)) {
                setOpenTransactionModal(true);
            } else {
                setOpenTransactionModal(()=>false);
            }

            if (transactionInfo.state === TransactionContextState.success || transactionInfo.state === TransactionContextState.final_success) {
                transactionInfo.onSuccess && transactionInfo.onSuccess();
            }
        }
    }, [transactionInfo]);

    return (
        <TransactionContext.Provider value={contextWrapper}>
            <TransactionDialogBox
                open={openTransactionModal}
                onOpen={setOpenTransactionModal}
                transactionContext={transactionInfo}
            />
            {props.children}
        </TransactionContext.Provider>
    );
};

export default TransactionContextProvider;
