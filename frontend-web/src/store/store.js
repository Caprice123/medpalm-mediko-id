import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {useSelector, useDispatch } from 'react-redux';
import auth from "./auth";
import calculator from "./calculator";
import common from "./common";
import credit from "./credit";
import exercise from "./exercise";
import flashcard from "./flashcard";
import tags from "./tags/reducer";
import tagGroups from "./tagGroups/reducer";
import session from "./session/reducer";
import feature from "./feature/reducer";
import statistic from "./statistic/reducer";
import pricing from "./pricing/reducer";
import summaryNotes from "./summaryNotes";
import user from "./user";
import anatomy from "./anatomy";

export const rootReducer = combineReducers({
    auth,
    calculator,
    common,
    credit,
    exercise,
    flashcard,
    tags,
    tagGroups,
    session,
    feature,
    statistic,
    pricing,
    summaryNotes,
    user,
    anatomy,
})

export const store = configureStore({
    reducer: rootReducer
})

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

export default store
