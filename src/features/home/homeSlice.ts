import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { Transaction } from "../../models/transaction";
import transactionsService from "../../services/transactionsService";
import { RootState } from "../../store/rootReducer";
import { AppThunk } from "../../store/store";

export interface HomePayload {
    isGettingTransactions: boolean,
    transactions: Transaction[],
    transactionsError: any
}

const initialState: HomePayload = {
    isGettingTransactions: true,
    transactions: [],
    transactionsError: null
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setTransactions(state, {payload}: PayloadAction<Transaction[]>) {
            state.transactions = payload;
        },
        setGettingTransactions: (state, {payload}: PayloadAction<boolean>) => {
            state.isGettingTransactions = payload;
        },
        setTransactionsFailed: (state, {payload}: PayloadAction<any>) => {
            state.transactionsError = payload;
        }
    }
});


export const getAllTransactions = (): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setGettingTransactions(true))
        let transactions = await transactionsService.getAll();
        dispatch(setTransactions(transactions.data));
    } catch (error) {
        dispatch(setTransactionsFailed(error))
    } finally {
        dispatch(setGettingTransactions(false))
    }
}

export const { setTransactions, setTransactionsFailed, setGettingTransactions } = homeSlice.actions;

export const homeSelector = (state: RootState) => state.home;
export default homeSlice.reducer;