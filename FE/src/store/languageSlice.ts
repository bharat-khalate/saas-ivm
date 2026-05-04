import { createSlice } from "@reduxjs/toolkit";

// languageSlice.ts
const languageSlice = createSlice({
    name: 'language',
    initialState: {
        lang: 'en',
    },
    reducers: {
        setLanguage: (state, action) => {
            state.lang = action.payload;
        },
    },
});

export const { setLanguage } = languageSlice.actions;