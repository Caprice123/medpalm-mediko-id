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
import pricing from "./pricing/reducer";
import summaryNotes from "./summaryNotes";
import user from "./user";
import diagnostic from "./diagnostic";
import anatomy from "./anatomy";
import mcq from "./mcq";
import constant from "./constant";
import chatbot from "./chatbot/reducer";
import skripsi from "./skripsi/reducer";
import oscePractice from "./oscePractice";
import atlas from "./atlas";
import webinar from "./webinar"
import event from "./event";
import featureSubscriptions from "./featureSubscriptions/reducer";
import banner from "./banner";
import challenge from "./challenge";
import profile from "./profile/reducer"
import featureNodes from "./featureNodes/reducer";
import review from "./review/reducer";

export const rootReducer = combineReducers({
    auth,
    calculator,
    constant,
    common,
    credit,
    exercise,
    flashcard,
    review,
    tags,
    tagGroups,
    session,
    feature,
    pricing,
    summaryNotes,
    user,
    diagnostic,
    anatomy,
    mcq,
    chatbot,
    skripsi,
    oscePractice,
    atlas,
    webinar,
    event,
    featureSubscriptions,
    banner,
    challenge,
    profile,
    featureNodes,
})

export const store = configureStore({
    reducer: rootReducer
})

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

export default store
