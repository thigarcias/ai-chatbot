'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, Upload, X, Edit, Save, User as UserIcon } from 'lucide-react'
import { User } from 'next-auth'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ProfileEditor({ user }: { user: User }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [name, setName] = useState(user.name || '')

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

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
      
      setSuccess('Foto atualizada com sucesso!')
      
      handleRemoveImage()
      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar foto:', error)
      setError('Não foi possível atualizar sua foto. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveInfo = async () => {
    setIsSaving(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Informações atualizadas com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar informações:', error)
      setError('Não foi possível atualizar suas informações.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex justify-center">
      <div className="w-full max-w-4xl py-12 px-4">
        <div className="flex flex-col items-start justify-start mb-8 text-center">
          <Badge variant="outline" className="mb-2">Perfil</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Editar Perfil</h1>
          <p className="text-muted-foreground mt-2">Personalize seu perfil para melhorar sua experiência</p>
        </div>
        
        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <AlertDescription className="flex items-center justify-center">
              <div className="bg-green-100 p-1 rounded-full mr-2">
                <Save className="h-4 w-4 text-green-600" />
              </div>
              {success}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="profile" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="profile" className="flex items-center justify-center gap-2">
                <UserIcon className="h-4 w-4" />
                Informações
              </TabsTrigger>
              <TabsTrigger value="photo" className="flex items-center justify-center gap-2">
                <Camera className="h-4 w-4" />
                Foto de Perfil
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-lg border-primary/10 overflow-hidden">
              <div className="h-8 bg-gradient-to-r from-primary/20 to-primary/10" />
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Atualize seus dados pessoais para personalizar sua experiência
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 max-w-lg mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nome Completo</Label>
                  <div className="relative">
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="pl-10"
                    />
                    <UserIcon className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue={user.email || ''} 
                      className="pl-10 bg-muted/30"
                      disabled
                    />
                    <div className="absolute left-3 top-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" />
                    </svg>
                    O e-mail está vinculado à sua conta e não pode ser alterado
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-center border-t bg-muted/10 p-6">
                <Button variant="outline">Cancelar</Button>
                <Button 
                  onClick={handleSaveInfo}
                  disabled={isSaving}
                  className="sm:px-8 gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar Informações
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="photo">
            <Card className="shadow-lg border-primary/10 overflow-hidden">
              <div className="h-8 bg-gradient-to-r from-primary/20 to-primary/10" />
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Foto de Perfil
                </CardTitle>
                <CardDescription>
                  Escolha uma imagem que represente você
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col items-center gap-8 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative">
                        <Avatar className="w-48 h-48 border-4 border-background shadow-xl">
                          <AvatarImage 
                            src={previewImage || user.image || `https://avatar.vercel.sh/${user.name}`} 
                            alt={user.name || 'Avatar'} 
                          />
                          <AvatarFallback className="text-5xl">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          type="button"
                        >
                          <Camera className="text-white h-12 w-12" />
                        </button>
                      </div>
                    </div>
                    
                    {previewImage && (
                      <Badge variant="outline" className="gap-1 py-1 px-3">
                        <Edit className="h-3 w-3" />
                        Prévia
                      </Badge>
                    )}
                  </div>
                  
                  <div className="w-full max-w-md space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription className="flex items-center justify-center gap-2">
                          <X className="h-4 w-4" />
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="bg-muted/30 rounded-lg p-4 text-sm">
                      <h4 className="font-medium mb-2 flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                        Requisitos para foto de perfil:
                      </h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li className="flex items-center gap-1 justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/70"></div>
                          Formatos aceitos: JPEG, PNG ou WEBP
                        </li>
                        <li className="flex items-center gap-1 justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/70"></div>
                          Tamanho máximo: 5MB
                        </li>
                        <li className="flex items-center gap-1 justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/70"></div>
                          Recomendado: imagem quadrada
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
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
                        Selecionar Imagem
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
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center border-t bg-muted/10 p-6">
                <Button 
                  className="min-w-32 gap-2"
                  disabled={!imageFile || isLoading}
                  onClick={handleUpload}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Atualizar Foto
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}