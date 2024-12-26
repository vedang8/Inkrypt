import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "../Slice/LoaderSlice";
import { userSlice } from "../Slice/UserSlice";

export const store = configureStore({
    reducer: {
        loader: loaderSlice.reducer,
        user: userSlice.reducer
    }
});

