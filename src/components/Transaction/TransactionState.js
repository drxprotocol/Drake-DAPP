
export const TransactionState = {
    PendingSignature: 'PendingSignature',
    Submit: 'Submit',
    Mining: 'Mining',
    Success: 'Success',
    Exception: 'Exception',

    Phased_PendingSignature: 'Phased_PendingSignature',
    Phased_Submit: 'Phased_Submit',
    Phased_Mining: 'Phased_Mining',
    Phased_Exception: 'Phased_Exception',
    Phased_Success: 'Phased_Success',
    Phased: 'Phased',

    Final_Exception: 'Final_Exception',
    Final_Mining: 'Final_Mining',
    Final_Success: 'Final_Success',
};

export const TransactionContextState = {
    confirm: 'confirm',
    pending: 'pending',
    success: 'success',
    rejected: 'rejected',
    failed: 'failed',

    phased_confirm: 'phased_confirm',
    phased_pending: 'phased_pending',
    phased_success: 'phased_success',
    phased_rejected: 'phased_rejected',
    phased_failed: 'phased_failed',

    final_rejected: 'final_rejected',
    final_failed: 'final_failed',
    final_pending: 'final_pending',
    final_success: 'final_success',
};

const stateMap = {
    [TransactionState.PendingSignature]: TransactionContextState.confirm,
    [TransactionState.Submit]: TransactionContextState.confirm,
    [TransactionState.Mining]: TransactionContextState.pending,
    [TransactionState.Success]: TransactionContextState.success,

    [TransactionState.Phased_PendingSignature]: TransactionContextState.phased_confirm,
    [TransactionState.Phased_Submit]: TransactionContextState.phased_confirm,
    [TransactionState.Phased_Mining]: TransactionContextState.phased_pending,
    [TransactionState.Phased_Success]: TransactionContextState.phased_success,
    [TransactionState.Phased]: TransactionContextState.pending,

    [TransactionState.Final_Mining]: TransactionContextState.final_pending,
    [TransactionState.Final_Success]: TransactionContextState.final_success,
};

export const convertTransactionStateToContextState = (transactionState, errorMsg) => {
    let contextState = '';

    switch (transactionState) {
        case TransactionState.Exception:
            contextState = errorMsg.indexOf('rejected') >= 0 ? TransactionContextState.rejected : TransactionContextState.failed;
            break;
        case TransactionState.Phased_Exception:
            contextState = errorMsg.indexOf('rejected') >= 0 ? TransactionContextState.phased_rejected : TransactionContextState.phased_failed;
            break;
        case TransactionState.Final_Exception:
            contextState = errorMsg.indexOf('rejected') >= 0 ? TransactionContextState.final_rejected : TransactionContextState.final_failed;
            break;
        default:
            contextState = stateMap[transactionState] || '';
            break;
    }

    // console.debug(`transactionState =>`, transactionState, `contextState =>`, contextState)

    return contextState;
};