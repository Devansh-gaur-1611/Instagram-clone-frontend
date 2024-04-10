import { configureStore } from "@reduxjs/toolkit"
import PostSlice from "../features/Post/PostSlice"
import UserSlice from "../features/User/UserSlice"
import LoadingSlice from "../features/Loading/LoadingSlice"
import SocketSlice from "../features/Sockets/SocketSlice"
export const store = configureStore({
    reducer: {
        postSlice: PostSlice,
        user: UserSlice,
        loading:LoadingSlice,
        socket:SocketSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
      }),
})