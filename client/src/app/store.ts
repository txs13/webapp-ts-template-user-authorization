import { configureStore } from '@reduxjs/toolkit'

import userReducer from './features/user.slice'
import roleReducer from './features/role.slice'
import appSettingsReducer from './features/appSettings.slice'

const store = configureStore({
    reducer: {
        user: userReducer,
        role: roleReducer,
        appSettings: appSettingsReducer
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch