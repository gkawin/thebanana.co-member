import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {},
})

export const UserActions = { ...userSlice.actions }
export default userSlice.reducer
