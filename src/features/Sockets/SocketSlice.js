import { createSlice } from "@reduxjs/toolkit"

const initialState = {}

const SocketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload
        }
    }
})

export const { setSocket } = SocketSlice.actions
export const getSocket = (state) => state.socket
export default SocketSlice.reducer