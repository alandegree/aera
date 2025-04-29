import { post } from './base'
import type { AuthParams } from '@/models/auth'

export const signup = (params: AuthParams) => {
  return post('/auth/register', params)
}

export const signin = (params: AuthParams) => {
  return post('/auth/login', params)
}

export const signout = () => {
  return post('/auth/logout', {})
}

export const sendPasswordResetEmail = (email: string) => {
  return post('/auth/password/reset', { body: { email } })
}

export const resetPassword = (params: { token: string, password: string }) => {
  return post('/auth/password/reset/confirm', { body: params })
}