import { configureStore } from '@reduxjs/toolkit'

import userReducer from './features/user.slice'
import roleReducer from './features/role.slice'
import tokenReducer from './features/token.slice'
import appSettingsReducer from './features/appSettings.slice'

const store = configureStore({
    reducer: {
        user: userReducer,
        role: roleReducer,
        token: tokenReducer,
        appSettings: appSettingsReducer
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch