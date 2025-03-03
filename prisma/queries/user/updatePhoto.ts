import { put } from '@vercel/blob'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function updateUserProfilePicture(userId: string, file: Buffer, fileName: string) {
  try {
    const { url } = await put(`users/${userId}/${fileName}`, file, { 
      access: 'public',
      contentType: 'image/jpeg'
    })

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: url },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true
      }
    })

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Erro ao atualizar foto do perfil:', error)
    return { success: false, error: 'Falha ao atualizar a foto do perfil' }
  }
}
