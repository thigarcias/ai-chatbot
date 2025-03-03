import { auth } from '@/app/(auth)/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return Response.json({ success: false, error: 'Não autenticado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return Response.json({ success: false, error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    console.log('Buffer criado com tamanho:', buffer.length)
    
    const { updateUserProfilePicture } = await import('@/prisma/queries/user/updatePhoto')
    
    const result = await updateUserProfilePicture(
      session.user.id,
      buffer,
      `profile-${Date.now()}-${file.name}`
    )
    
    return Response.json({
      success: result.success,
      user: result.user,
      error: result.error
    }, { status: result.success ? 200 : 400 })

  } catch (error: any) {
    console.error('Erro no processamento do upload:', error)
    
    return Response.json({
      success: false, 
      error: error?.message || 'Erro ao processar imagem'
    }, { status: 500 })
  }
}