import { configureStore } from "@reduxjs/toolkit"
import PostSlice from "../features/Post/PostSlice"
import UserSlice from "../features/User/UserSlice"
export const store = configureStore({
    reducer: {
        postSlice: PostSlice,
        user: UserSlice
    },
})