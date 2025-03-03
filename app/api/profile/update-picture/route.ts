import { NextRequest, NextResponse } from 'next/server'
import { updateUserProfilePicture } from '@/prisma/queries/user/updatePhoto'
import { auth } from '@/app/(auth)/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Converter File para Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Atualizar foto do usuário
    const result = await updateUserProfilePicture(
      session.user.id as string,
      buffer,
      `profile-${Date.now()}-${file.name}`
    )

    if (!result.success) {
      throw new Error(result.error || 'Erro ao atualizar foto')
    }

    return NextResponse.json({ 
      success: true, 
      user: result.user 
    })
  } catch (error) {
    console.error('Erro no processamento do upload:', error)
    return NextResponse.json(
      { error: 'Erro ao processar imagem' }, 
      { status: 500 }
    )
  }
}