import ApplicationConfig from "../../ApplicationConfig";
import {TransactionState} from "./TransactionState";
import {fetchOrderHistoryEventFromSubgraph} from "../../hooks/useTrdingMeta";

const queryLog = (contract, filterLog, reqIdentifier, checkStartedTimestamp, onChecked, onTimeout) => {
    console.debug(`query logs to double check TX state...`);

    let _checkStartedTimestamp = checkStartedTimestamp || new Date().getTime();
    contract.queryFilter(filterLog, -100, "latest").then(logs => {
        console.debug(`logs =>`, logs, `reqIdentifier =>`, reqIdentifier);

        if(!logs.length){
            let now = new Date().getTime();
            if((_checkStartedTimestamp + ApplicationConfig.defaultTimeoutToDoubleCheckOrderState) < now){
                onTimeout && onTimeout();
            } else {
                setTimeout(() => {
                    queryLog(contract, filterLog, reqIdentifier, _checkStartedTimestamp, onChecked, onTimeout);
                }, 1000);
            }
        } else {
            let filterLogs = logs.filter(log => {
                let theReqIdentifier = parseInt(log.args[0]?._hex, 16);
                return theReqIdentifier === reqIdentifier;
            });

            if(filterLogs.length){
                console.debug(`Checked with log`);
                onChecked && onChecked();
            } else {
                let now = new Date().getTime();
                if((_checkStartedTimestamp + ApplicationConfig.defaultTimeoutToDoubleCheckOrderState) < now){
                    onTimeout && onTimeout();
                } else {
                    setTimeout(() => {
                        queryLog(contract, filterLog, reqIdentifier, _checkStartedTimestamp, onChecked, onTimeout);
                    }, 1000);
                }
            }
        }
    });
};

const queryEventFromSubgraph = (chainId, portfolioAddress, reqIdentifier, checkStartedTimestamp, onChecked, onTimeout, checkStateGetter) => {
    if(checkStateGetter && !checkStateGetter()){
        console.debug(`query events from subgraph to double check TX state...`);

        let _checkStartedTimestamp = checkStartedTimestamp || new Date().getTime();
        fetchOrderHistoryEventFromSubgraph({chainId, portfolioAddress, reqIdentifier, first: 1}).then(events => {
            console.debug(`events =>`, events, `reqIdentifier =>`, reqIdentifier);

            if(!events.length){
                let now = new Date().getTime();
                if((_checkStartedTimestamp + ApplicationConfig.defaultTimeoutToDoubleCheckOrderState) < now){
                    onTimeout && onTimeout();
                } else {
                    setTimeout(() => {
                        queryEventFromSubgraph(chainId, portfolioAddress, reqIdentifier, _checkStartedTimestamp, onChecked, onTimeout, checkStateGetter);
                    }, 1000);
                }
            } else {
                console.debug(`Checked with subgraph`);
                onChecked && onChecked();
            }
        });
    }
};

export const doubleCheckWithTxLog = (transactionGlobalContext, txContext, contract, event, sharedData) => {
    console.debug(`double check TX state... current timestamp =>`, new Date().getTime(), sharedData);

    let checked = false;
    let timeout = false;

    let filter = event();
    let filterLog = {
        topics : filter.topics
    };

    let onChecking = () => {
        console.info(`checking TX state...`);

        if (!checked) {
            let _state = {
                status: TransactionState.Final_Mining,
            };
            let _context = {
                ...txContext,
                ..._state,
            };
            transactionGlobalContext.dispatch(_context);
        }
    };

    let onChecked = () => {
        console.info(`TX has been checked finally!`);

        if(!checked){
            let _state = {
                status: TransactionState.Final_Success,
            };
            let _context = {
                ...txContext,
                ..._state,
            };
            transactionGlobalContext.dispatch(_context);

            checked = true;
        }
    };

    let onTimeout = () => {
        console.info(`TX maybe has been reverted! current timestamp =>`, new Date().getTime());

        if(!checked && !timeout){
            let _state = {
                status: TransactionState.Final_Exception,
            };
            let _context = {
                ...txContext,
                ..._state,
            };
            transactionGlobalContext.dispatch(_context);

            contract.off(filterLog);
            timeout = true;
        }
    };

    contract.on(filterLog, (_reqIdentifer, event) => {
        let reqIdentifier = parseInt(_reqIdentifer?._hex, 16);
        console.log(`Event:`, reqIdentifier, sharedData);

        if(reqIdentifier === sharedData?.reqIdentifier){
            console.debug(`Checked with Event!`);
            onChecked();

            event.removeListener();
        }
    });

    setTimeout(() => {
        if(!checked){
            onTimeout();
        }
    }, ApplicationConfig.defaultTimeoutToDoubleCheckOrderState);

    setTimeout(() => {
        onChecking();
    }, 300);

    // sometime event listener is not works. so we need a backup solution for this.
    queryLog(contract, filterLog, sharedData?.reqIdentifier, undefined, onChecked, onTimeout);

    if(sharedData?.portfolioAddress && sharedData?.reqIdentifier){
        queryEventFromSubgraph(txContext?.chainId, sharedData?.portfolioAddress, sharedData?.reqIdentifier, undefined, onChecked, onTimeout, ()=>{return checked;});
    }
};