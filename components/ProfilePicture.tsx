'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, Upload, X } from 'lucide-react'
import { User } from 'next-auth'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function ProfileEditor({ user }: { user: User }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Por favor, selecione uma imagem (JPEG, PNG ou WEBP).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter menos de 5MB.')
      return
    }

    setError(null)
    setImageFile(file)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setImageFile(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpload = async () => {
    if (!imageFile) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      
      const response = await fetch('/api/profile/update-picture', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar imagem')
      }
      
      console.log('Foto atualizada com sucesso!')
      
      handleRemoveImage()
      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar foto:', error)
      setError('Não foi possível atualizar sua foto. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8">Editar Perfil</h1>
      
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>
              Atualize sua foto de perfil
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center gap-6">
            <div className="relative group">
              <Avatar className="w-40 h-40 border-4 border-primary/10">
                <AvatarImage 
                  src={previewImage || user.image || `https://avatar.vercel.sh/${user.name}`} 
                  alt={user.name || 'Avatar'} 
                />
                <AvatarFallback className="text-4xl">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <Camera className="text-white h-10 w-10" />
              </button>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm w-full text-center">
                {error}
              </div>
            )}
            
            <div className="flex items-center gap-2 w-full">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline" 
                className="flex-1"
                disabled={isLoading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Selecionar
              </Button>
              
              {previewImage && (
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full"
              disabled={!imageFile || isLoading}
              onClick={handleUpload}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : 'Atualizar Foto'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize seus dados pessoais
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                defaultValue={user.name || ''} 
                placeholder="Seu nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={user.email || ''} 
                disabled
              />
              <p className="text-sm text-muted-foreground">
                O e-mail não pode ser alterado
              </p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button className="w-full">
              Salvar Informações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
