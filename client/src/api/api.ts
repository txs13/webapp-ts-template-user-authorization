import axios from 'axios'
import { LoginInput } from './apiDatatypes'
import getConfig from '../config/config'

const { baseApiUrl, userApi, roleApi, reqOptions, reqOptionsToken } = getConfig()

const client = axios.create({
    baseURL: baseApiUrl,
    timeout: 1000
})

const refresh = () => {

}

export const login = async ({email, password}: LoginInput) => {
    const response = await client.post(`${userApi}/login`, {reqOptions})
    
    
}

export const register = () => {

}

export const getPublicRoles = () => {

}
