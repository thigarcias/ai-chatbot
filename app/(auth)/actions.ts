'use server'

import { z } from 'zod'

import { signIn } from './auth'
import { createUser, getUser } from '@/prisma/queries/user'

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data'
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    return { status: 'success' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' }
    }

    return { status: 'failed' }
  }
}

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data'
    | 'not_allowed'
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    const user = await getUser(validatedData.email)

    if (user) {
      return { status: 'user_exists' } as RegisterActionState
    }

    try {
      await createUser(validatedData.email, validatedData.password)
      await signIn('credentials', {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      })

      return { status: 'success' }
    } catch (error) {
      if (error instanceof Error && error.message === 'Registration not allowed for this email') {
        return { status: 'not_allowed' }
      }
      throw error
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' }
    }

    return { status: 'failed' }
  }
}
