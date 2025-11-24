import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {useSelector, useDispatch } from 'react-redux';
import auth from "./auth";
import common from "./common";
import credit from "./credit";
import exercise from "./exercise";
import flashcard from "./flashcard";
import tags from "./tags/reducer";
import session from "./session/reducer";
import feature from "./feature/reducer";
import statistic from "./statistic/reducer";
import summaryNotes from "./summaryNotes";

export const rootReducer = combineReducers({
    auth,
    common,
    credit,
    exercise,
    flashcard,
    tags,
    session,
    feature,
    statistic,
    summaryNotes,
})

export const store = configureStore({
    reducer: rootReducer
})

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

export default store
