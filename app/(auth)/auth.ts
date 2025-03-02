import { compare } from 'bcrypt-ts'
import NextAuth, { type User, type Session } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { authConfig } from './auth.config'
import { getUser } from '@/prisma/queries/user'

interface ExtendedSession extends Session {
  user: User
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email)
        if (!users) return null
        const passwordsMatch = await compare(password, users.password!)
        if (!passwordsMatch) return null

        return users as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      return token
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession
      token: any
    }) {
      if (session.user) {
        const user = await getUser(session.user.email ?? '')
        session.user.name = user?.name
        session.user.id = token.id as string
      }

      return session
    },
  },
})
