import express from 'express'
import {validateResource} from '../middleware/validateResource'
import { createRoleHandler } from '../controllers/role.controller'
import { createRoleSchema } from '../schemas/role.schema'

const roleRouter = express.Router()
// create role with rolename validation 
// TODO: create this route for admin only use
roleRouter.post('/', validateResource(createRoleSchema), createRoleHandler)

export default roleRouter