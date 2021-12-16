import { combineReducers } from '@reduxjs/toolkit';
import homeReducer from '../features/home/homeSlice';

const rootReducer = combineReducers({
    home: homeReducer
})

export type RootState = ReturnType<any>

export default rootReducer;