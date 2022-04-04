import { configureStore } from '@reduxjs/toolkit'

import userReducer from './features/user.slice'
import roleReducer from './features/role.slice'
import tokenReducer from './features/token.slice'

const store = configureStore({
    reducer: {
        user: userReducer,
        role: roleReducer,
        token: tokenReducer
    }
})

export default store