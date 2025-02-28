import { prisma } from '@/prisma/prisma-client'
import { genSaltSync, hashSync } from 'bcrypt-ts'

export async function createUser(email: string, password: string) {
  // Lista de domínios ou emails autorizados
  const allowedEmails = ['gurib2005@gmail.com', 'amanda.alle.bazoli@gmail.com']
  const allowedDomains = ['gmail.com'] // Exemplo: permitir qualquer email do gmail

  // Verificar se o email está na lista de permitidos ou tem um domínio permitido
  const domain = email.split('@')[1]
  const isAllowed = allowedEmails.includes(email) || allowedDomains.includes(domain)

  if (!isAllowed) {
    throw new Error('Registration not allowed for this email')
  }

  const salt = genSaltSync(10)
  const hash = hashSync(password, salt)

  return await prisma.user.create({
    data: { email, password: hash }
  })
}
