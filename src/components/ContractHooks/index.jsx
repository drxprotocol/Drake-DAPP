import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    // useContractFunction,
    useCall,
    useCalls,
    useBlockNumber,
    useUpdateConfig,
    useEthers,
    useConfig,
} from '@usedapp/core';
import { Contract, providers } from 'ethers';
import WebThreeContext from '../WebThreeProvider/WebThreeContext';
import TransactionContext from '../Transaction/TransactionContext';
import { DefaultChain } from '../../contract/ChainConfig';
import ApplicationConfig from "../../ApplicationConfig";
import ContractConfig from "../../contract/ContractConfig";
import BigNumber from 'bignumber.js';
import {TokenAmount} from "../../utils/TokenAmountConverter";
import {
    estimateTransactionGasLimit,
    usePromiseTransaction
} from "@usedapp/core/dist/esm/src/hooks/usePromiseTransaction";
import {useReadonlyNetworks} from "@usedapp/core/dist/esm/src/providers";
import {getSignerFromOptions} from "@usedapp/core/dist/esm/src/helpers/getSignerFromOptions";
import {TransactionContextState, TransactionState} from "../Transaction/TransactionState";
import {useContractFunction} from "./useContractFunction";
import {checkSocialWallet} from "../Modals/WalletSelector/WalletConfig";
import TransactionSenderContext from "../Transaction/TransactionSenderContext";


export function useSendTransaction(options, signer) {
    const { library, chainId } = useEthers();
    const transactionChainId = (options && 'chainId' in options && options?.chainId) || chainId;
    const { promiseTransaction, state, resetState } = usePromiseTransaction(transactionChainId, options);

    const config = useConfig();
    const gasLimitBufferPercentage =
        options?.gasLimitBufferPercentage ?? options?.bufferGasLimitPercentage ?? config?.gasLimitBufferPercentage ?? 0;

    const providers = useReadonlyNetworks();
    const provider = (transactionChainId && providers[transactionChainId]);

    const sendTransaction = async (transactionRequest) => {
        const _signer = signer || getSignerFromOptions(provider, options, library);

        if (_signer) {
            const gasLimit = await estimateTransactionGasLimit(transactionRequest, _signer, gasLimitBufferPercentage);

            return promiseTransaction(
                _signer.sendTransaction({
                    ...transactionRequest,
                    gasLimit,
                }),
                {
                    safeTransaction: {
                        to: transactionRequest.to,
                        value: transactionRequest.value?.toString(),
                    },
                }
            )
        }
    };

    return { sendTransaction, state, resetState };
}



export function useETHSend(txContent, txOptions, onSuccess) {
    const web3Context = useContext(WebThreeContext);
    const signer = web3Context?.web3Signer;
    const transactionContext = useContext(TransactionContext);
    const { state, sendTransaction: doSend } = useSendTransaction(txOptions || {}, signer);
    const [sharedData, setSharedData] = useState({});
    const [txContentLocal, setTxContentLocal] = useState(txContent);

    const sendTxAndShareData = (_txContent, _sharedData, ...args) => {
        console.debug(`send proxy...`);
        setSharedData(_sharedData);

        let _txContentLocal = _txContent || txContent || 'Transaction';
        setTxContentLocal(_txContentLocal);

        transactionContext.dispatch({
            status: 'Submit',
            timestamp: new Date().getTime(),
            txContent: _txContentLocal,
        });
        doSend(...args);
    };

    const sendTx = (_txContent, ...args) => {
        sendTxAndShareData(_txContent, {}, ...args);
    };

    const sendAndShareData = (_sharedData, ...args) => {
        sendTxAndShareData(txContent, _sharedData, ...args);
    };

    const send = (...args) => {
        sendAndShareData({}, ...args);
    };

    useEffect(() => {
        // console.debug(`current tx state => `, state, `events => `, events);
        transactionContext.dispatch({
            ...state,
            timestamp: transactionContext?.transactionInfo?.timestamp,
            txContent: txContentLocal,
            txType: 'ETH',
            onSuccess: () => {
                onSuccess && onSuccess({}, sharedData);
            },
        });
    }, [state]);

    return { state, send, sendAndShareData, sendTx, sendTxAndShareData };
}



/**
 * send a new transaction
 * @param contract
 * @param sendMethod
 * @param txContent
 * @param txOptions
 * @param txType    REC20|CONTRACT_INTERACTION
 * @param onSuccess
 * @param onDoubleCheck
 */
export function useContractSend(contract, sendMethod, txContent, txOptions, txType, onSuccess, onDoubleCheck) {
    const web3Context = useContext(WebThreeContext);

    const transactionContext = useContext(TransactionContext);
    const transactionSenderContext = useContext(TransactionSenderContext);

    const { state, send: doSend, events } = useContractFunction(contract, sendMethod, txOptions || {});
    const [sharedData, setSharedData] = useState({});
    const [txContentLocal, setTxContentLocal] = useState(txContent);
    const [transactionContextLocal, setTransactionContextLocal] = useState({});
    const [timestamp, setTimestamp] = useState(0);

    const [executingTransactions, setExecutingTransactions] = useState([]);

    const sendTxAndShareData = (_txContent, _sharedData, ...args) => {
        console.debug(`push tx to txQueue...`);
        setSharedData(_sharedData);

        let _txContentLocal = _txContent || txContent || 'Transaction';
        setTxContentLocal(_txContentLocal);

        let _timestamp = new Date().getTime();
        let txIdentifier = _timestamp;
        setTimestamp(_timestamp);

        let status = onDoubleCheck ? TransactionState.Phased_Submit : TransactionState.Submit;
        let _context = {
            status: status,
            timestamp: _timestamp,
            txContent: _txContentLocal,
            sharedData: _sharedData,
            chainId: web3Context.chainId,
        };
        // console.debug(`new tx =>`, _context);
        transactionContext.dispatch(_context);
        setTransactionContextLocal(_context);

        let _executingTransactions = [
            _context,
            ...executingTransactions
        ];
        setExecutingTransactions(_executingTransactions);

        let _txQueueItem = {
            txContext: _context,
            txSender: () => {
                console.debug(`send tx:`, _context);
                doSend(txIdentifier, ...args);
            }
        };
        transactionSenderContext.dispatch(_txQueueItem);
    };

    const sendTx = (_txContent, ...args) => {
        sendTxAndShareData(_txContent, {}, ...args);
    };

    const sendAndShareData = (_sharedData, ...args) => {
        sendTxAndShareData(txContent, _sharedData, ...args);
    };

    const send = (...args) => {
        sendAndShareData({}, ...args);
    };

    useEffect(() => {
        let executingTx = executingTransactions.find(tx => {
             return tx.timestamp === state.txIdentifier;
        });
        if(executingTx){
            // console.debug(`current tx state => `, state, `events => `, events, `executingTx =>`, executingTx);
            let _context = {
                ...executingTx,
                ...state,
                txType: txType,
                chainId: web3Context.chainId,
                onSuccess: () => {
                    onSuccess && onSuccess(events, executingTx?.sharedData);
                },
            };
            // console.debug(`tx =>`, _context);

            if(onDoubleCheck){
                let status = `Phased_${state?.status}`;
                let _state = {
                    ...state,
                    status: status,
                };
                _context = {
                    ..._context,
                    ..._state,
                    chainId: web3Context.chainId,
                };

                if(state?.status === TransactionState.Success){
                    onDoubleCheck(_context, contract, executingTx?.sharedData);
                }
            }

            // console.debug(`tx =>`, _context);
            setTransactionContextLocal(_context);
            transactionContext.dispatch(_context);
        } else {
            // console.debug(`executingTx[txIdentifier=${state.txIdentifier}] is not found. state =>`, state);
        }
    }, [state]);

    return { state, send, sendAndShareData, sendTx, sendTxAndShareData };
}

export function useConfiguredContract(configuredContract) {
    const web3Context = useContext(WebThreeContext);
    const contractAddress =
        configuredContract?.theAddress ||
        (configuredContract?.address && configuredContract.address(web3Context.chainId)) ||
        undefined;
    const signer = web3Context?.web3Signer;
    const contract = contractAddress && new Contract(contractAddress, configuredContract?.abi, signer);
    return contract;
}

/**
 * Fetch contract from ContractConfig, and send a transaction
 * @param configuredContract
 * @param sendMethod
 * @param txContent
 * @param txOptions
 * @param onSuccess
 * @param onDoubleCheck
 * @returns {{state: import("..").TransactionStatus, send: (...args: Params<TypedContract, ContractFunctionNames<T>>) => Promise<TransactionReceipt | undefined>}}
 */
export function useConfiguredContractSend(configuredContract, sendMethod, txContent, txOptions, onSuccess, onDoubleCheck) {
    const contract = useConfiguredContract(configuredContract);
    return useContractSend(contract, sendMethod, txContent, txOptions, 'CONTRACT_INTERACTION', onSuccess, onDoubleCheck);
}

export function useTokenContractSend(tokenAddress, sendMethod, txContent, txOptions, onSuccess) {
    const tokenContractConfig = {
        ...ContractConfig.asset.ERC20,
        theAddress: tokenAddress,
    };
    const tokenContract = useConfiguredContract(tokenContractConfig);
    return useContractSend(tokenContract, sendMethod, txContent, txOptions, 'REC20', onSuccess);
}

const buildDefaultProvider = (web3Context) => {
    if(web3Context?.connectStrategy !== ApplicationConfig.walletConnectStrategy.rainbowKit){
        return undefined;
    }

    if(web3Context?.connectStrategy === ApplicationConfig.walletConnectStrategy.rainbowKit && web3Context?.web3Provider){
        return web3Context?.web3Provider;
    }

    return undefined;
    // TODO need to extend here, to support multi chains.
    // if(web3Context.account){
    //     return undefined;
    // }
    //
    // let provider = new providers.StaticJsonRpcProvider(
    //     DefaultChain.rpcUrl,
    //     {
    //         chainId: DefaultChain.chainId,
    //         name: DefaultChain.chainName,
    //     }
    // );
    // // console.debug(`created default provider => `, provider);
    // return provider;
};

/**
 * call contract function and fetch data
 * @param configuredContract
 * @param callMethod
 * @param args
 * @returns {*}
 */
export function useContractCall(configuredContract, callMethod, args) {
    const blockHeight = useBlockNumber();
    const web3Context = useContext(WebThreeContext);
    const chainId = web3Context?.chainId || DefaultChain.chainId;

    const contractAddress =
        configuredContract?.theAddress ||
        (configuredContract?.address && configuredContract.address(web3Context.chainId)) ||
        undefined;

    const provider = contractAddress && buildDefaultProvider(web3Context);
    const queryParams = {chainId};
    const { value, error } =
        useCall(
            blockHeight && contractAddress && {
                contract: new Contract(contractAddress, configuredContract.abi, provider),
                method: callMethod,
                args: args ?? [],
            },
            queryParams
        ) ?? {};

    if (error) {
        console.error(`Error encountered calling '${callMethod}' on ${contractAddress}: ${error.message}`, `args:`, args, `web3Context:`, web3Context);
        return undefined;
    }
    return value;
}

/**
 * e.g
 *  1.  const getPositionIdsCallsResult = useContractCalls({
            contract: ContractConfig.Uniswap.PositionManager,
            callMethod: 'tokenOfOwnerByIndex',
            args: [web3Context.account, 0]
        },{
            contract: ContractConfig.Uniswap.PositionManager,
            callMethod: 'tokenOfOwnerByIndex',
            args: [web3Context.account, 1]
        });
 *  2. const getPositionIdsCallsResult = useContractCalls([{
            contract: ContractConfig.Uniswap.PositionManager,
            callMethod: 'tokenOfOwnerByIndex',
            args: [web3Context.account, 0]
        },{
            contract: ContractConfig.Uniswap.PositionManager,
            callMethod: 'tokenOfOwnerByIndex',
            args: [web3Context.account, 1]
        }]);
 *
 * @param calls
 * @returns {*}
 */
export function useContractCalls(...calls) {
    const blockHeight = useBlockNumber();
    const web3Context = useContext(WebThreeContext);
    const chainId = web3Context?.chainId || DefaultChain.chainId;

    const updateConfig = useUpdateConfig();
    const transactionContext = useContext(TransactionContext);
    useEffect(() => {
        // console.debug(`transactionContext?.transactionInfo?.state =>`, transactionContext?.transactionInfo?.state);

        if(transactionContext?.transactionInfo?.state === TransactionContextState.success ||
            transactionContext?.transactionInfo?.state === TransactionContextState.phased_success
        ){
            // Refresh data when the TX is successful immediately
            updateConfig({
                pollingInterval: 1000
            });

            setTimeout(() => {
                updateConfig({
                    pollingInterval: 15000
                });
            }, transactionContext?.transactionInfo?.state === TransactionContextState.success ? 15000 : 25000);
        }
    }, [transactionContext?.transactionInfo?.state]);

    const __calls = calls && calls.length && calls[0] instanceof Array ? calls[0] : calls;
    const _calls = useMemo(() => {
        let rebuildCalls = __calls?.map((call) => {
            let contractAddress =
                call?.contract?.theAddress ||
                (call?.contract?.address && call?.contract.address(web3Context.chainId)) ||
                undefined;
            if(contractAddress === ApplicationConfig.emptyContractAddress){
                contractAddress = undefined;
            }

            let provider = contractAddress && buildDefaultProvider(web3Context);
            return (
                blockHeight && contractAddress && {
                    contract: new Contract(contractAddress, call?.contract?.abi, provider),
                    method: call?.callMethod,
                    args: call?.args ?? [],
                }
            );
        }) ?? [];
        rebuildCalls = rebuildCalls.filter((call) => call);
        return rebuildCalls;
    }, [__calls, blockHeight, web3Context]);

    const queryParams = {chainId};
    const callsResult = useCalls(_calls, queryParams) ?? [];

    return useMemo(() => {
        if (callsResult.length === 0) {
            return [];
        }

        return callsResult.map((result, index) => {
            if(result && result.error) {
                console.error(`Error encountered calling '${_calls[index].method}' on ${_calls[index]?.contract.address}: ${result.error.message}`, `call:`, _calls[index], `web3Context:`, web3Context);
                return {};
            }

            return result?.value || {};
        });
    }, [callsResult]);
}


export const useApprove = (token, tokenInputAmount, spender, approveTitle, onApproved) => {
    const web3Context = useContext(WebThreeContext);
    const [needToApprove, setNeedToApprove] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const tokenAddress = token?.address;

    const [defaultApproveAmount, setDefaultApproveAmount] = useState(new TokenAmount(ApplicationConfig.defaultApproveAllowance));
    useEffect(() => {
        let amount = new TokenAmount(ApplicationConfig.defaultApproveAllowanceTokenAmount, token, true);
        setDefaultApproveAmount(amount);
        console.debug(`defaultApproveAmount =>`, amount);
    }, [tokenAddress]);

    const checkApprove = () => {
        return new Promise((resolve, reject) => {
            if (token?.native || !tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000' || !spender || spender === '0x0000000000000000000000000000000000000000') {
                resolve(false);
                return;
            }

            let provider = web3Context?.web3Provider || window.dappWeb3Provider || ApplicationConfig.provider;

            let tokenContract = new Contract(tokenAddress, ContractConfig.asset.ERC20.abi, provider);
            tokenContract
                .allowance(web3Context.account, spender)
                .then((allowance) => {
                    let allowanceNb = new BigNumber(allowance?._hex, 16);
                    let tokenAmount = tokenInputAmount?.tokenAmount ? tokenInputAmount?.tokenAmount : tokenInputAmount;
                    let isNeedApprove = allowanceNb.lt(tokenAmount.amountOnChain.bigNumber);

                    // console.debug(
                    //     `checkApprove: address =>`,
                    //     tokenAddress,
                    //     `spender =>`,
                    //     spender,
                    //     `checkAmount =>`,
                    //     tokenAmount.amount.value,
                    //     `allowance =>`,
                    //     allowance,
                    //     `allowanceNb =>`,
                    //     allowanceNb.toFixed(),
                    //     `isNeedApprove =>`,
                    //     isNeedApprove,
                    // );

                    resolve(isNeedApprove);
                })
                .catch((e) => {
                    console.error(e);
                    resolve(false);
                });
        });
    };

    const doCheckApprove = () => {
        checkApprove().then((isNeedApprove) => {
            setNeedToApprove(isNeedApprove);
            setLoaded(true);
        });
    };

    const { send: sendApprove, sendAndShareData: sendAndShareDataForApprove } = useTokenContractSend(
        tokenAddress || '0x0000000000000000000000000000000000000000',
        'approve',
        approveTitle,
        null,
        (events, sharedData) => {
            checkApprove().then((isNeedApprove) => {
                setNeedToApprove(isNeedApprove);

                if (!isNeedApprove) {
                    onApproved && onApproved(events, sharedData);
                }
            });
        },
    );

    useEffect(() => {
        doCheckApprove();
    }, [tokenAddress, tokenInputAmount, spender]);

    return {
        loaded,
        needToApprove,
        checkApprove,
        defaultApproveAmount,
        send: sendApprove,
        sendAndShareData: sendAndShareDataForApprove,
    };
};