import { put } from '@vercel/blob'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function updateUserProfilePicture(userId: string, file: Buffer, fileName: string) {
  try {
    if (!userId) throw new Error('ID do usuário é obrigatório')
    if (!file || file.length === 0) throw new Error('Arquivo inválido')
    if (!fileName) throw new Error('Nome do arquivo é obrigatório')
    
    const { url } = await put(`users/${userId}/${fileName}`, file, { 
      access: 'public',
      contentType: 'image/jpeg'
    })

    console.log('URL da imagem:', url)
    console.log('ID do usuário:', userId)

    let updatedUser = null;
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      console.log(user)
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: url }
      })
    } catch (error: any) {
      console.error('Erro ao atualizar foto do perfil:', error)
      throw error; // Re-throw to be caught by outer try-catch
    }

    return { success: true, user: updatedUser }
  } catch (error: any) {
    console.error('Erro ao atualizar foto do perfil:', error)
    return { 
      success: false, 
      error: error?.message || 'Falha ao atualizar a foto do perfil',
      user: null
    }
  }
}