import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "../Slice/LoaderSlice";
import { userSlice } from "../Slice/UserSlice";

const store = configureStore({
    reducer: {
        loader: loaderSlice.reducer,
        user: userSlice.reducer
    }
});

export default store;