import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    email: string | null
}

const initialState: AuthState = {
    email: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
        logoutUser: (state) => {
            state.email = null
        }
    }
})

export const { loginUser, logoutUser } = authSlice.actions
export default authSlice.reducer
