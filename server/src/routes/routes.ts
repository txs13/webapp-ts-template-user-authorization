import express from 'express'
import userRouter from './user.route'
import roleRouter from './role.route'

const mainRouter = express.Router()

mainRouter.use('/user', userRouter)
mainRouter.use('/role', roleRouter)

export default mainRouter