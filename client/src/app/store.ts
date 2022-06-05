import { configureStore } from '@reduxjs/toolkit'

import userReducer from './features/user.slice'
import roleReducer from './features/role.slice'
import appSettingsReducer from './features/appSettings.slice'
import appAlerMessageReducer from './features/appAlertMessage.slice'

const store = configureStore({
    reducer: {
        user: userReducer,
        role: roleReducer,
        appSettings: appSettingsReducer,
        appAlertMessage: appAlerMessageReducer
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch