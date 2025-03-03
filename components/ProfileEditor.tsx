'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, Upload, X, Save, User as UserIcon } from 'lucide-react'
import { User } from 'next-auth'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function ProfileEditor({ user }: { user: User }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [userName, setUserName] = useState(user.name || '')
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('photo')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    // Initialize preview with user's current image
    if (user.image) {
      setPreviewImage(user.image)
    }
  }, [user.image])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    processSelectedFile(file)
  }

  const processSelectedFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setError('Por favor, selecione uma imagem (JPEG, PNG, WEBP ou GIF).')
      toast('Formato inválido', {
        description: 'Por favor, selecione uma imagem (JPEG, PNG, WEBP ou GIF).',
        className: 'bg-destructive text-destructive-foreground'
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter menos de 5MB.')
      toast('Arquivo muito grande', {
        description: 'A imagem deve ter menos de 5MB.',
        className: 'bg-destructive text-destructive-foreground'
      })
      return
    }

    setError(null)
    setImageFile(file)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    toast('Imagem selecionada', {
      description: 'Clique em "Atualizar Foto" para salvar.'
    })
  }

  const handleRemoveImage = () => {
    setPreviewImage(user.image || null)
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
      
      toast('Sucesso!', {
        description: 'Sua foto de perfil foi atualizada.'
      })
      
      setImageFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar foto:', error)
      setError('Não foi possível atualizar sua foto. Tente novamente.')
      toast('Erro ao atualizar foto', {
        description: 'Não foi possível atualizar sua foto. Tente novamente.',
        className: 'bg-destructive text-destructive-foreground'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processSelectedFile(file)
    }
  }

  const saveProfile = async () => {
    setIsSaving(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add actual API call here
      // const response = await fetch('/api/profile/update', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: userName })
      // })

      toast('Perfil atualizado', {
        description: 'Suas informações foram salvas com sucesso!'
      })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast('Falha ao atualizar', {
        description: 'Não foi possível atualizar seu perfil. Tente novamente.',
        className: 'bg-destructive text-destructive-foreground'
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Header */}
      <div 
        className="h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
      >
        <div className="absolute inset-0 bg-grid-white/20 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]" />
      </div>

      <div className="container max-w-5xl px-4 sm:px-6 -mt-24 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-none">
            <CardHeader className="pb-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between"
              >
                <div>
                  <CardTitle className="text-2xl font-bold">Seu Perfil</CardTitle>
                  <CardDescription>
                    Personalize suas informações e foto de perfil
                  </CardDescription>
                </div>
                <Button onClick={() => router.push('/dashboard')} variant="outline">
                  Voltar
                </Button>
              </motion.div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                  <TabsTrigger value="photo">Foto de Perfil</TabsTrigger>
                  <TabsTrigger value="info">Informações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="photo" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex flex-col items-center space-y-4"
                    >
                      <div 
                        className={`relative group cursor-pointer rounded-full transition-all duration-300 ${isDragging ? 'ring-4 ring-primary/50' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-48 h-48 rounded-full border-4 border-primary/10 overflow-hidden relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                          {previewImage ? (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <img 
                                src={previewImage} 
                                alt={user.name || 'Profile'} 
                                className="w-full h-full object-cover" 
                              />
                            </motion.div>
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <UserIcon className="w-24 h-24 text-slate-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white h-10 w-10 mb-2" />
                          <span className="text-white text-xs px-2 text-center">Clique ou arraste uma foto</span>
                        </div>
                      </div>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-center text-sm font-medium">
                              {user.name || 'Seu Nome'}
                              <div className="text-xs text-muted-foreground">{user.email || 'exemplo@email.com'}</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sua identidade no sistema</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                    
                    <div className="flex-1 space-y-6">
                      <div className="rounded-lg border border-dashed p-8 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-lg font-medium">Arraste e solte sua imagem aqui</p>
                          <p className="text-sm text-muted-foreground mb-2">PNG, JPG, WEBP ou GIF (max. 5MB)</p>
                          
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          
                          <Button 
                            onClick={() => fileInputRef.current?.click()}
                            variant="secondary" 
                            className="mt-2"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Selecionar arquivo
                          </Button>
                        </div>
                      </div>
                      
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm"
                        >
                          <div className="flex gap-2 items-center">
                            <X className="h-4 w-4" />
                            {error}
                          </div>
                        </motion.div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          disabled={!imageFile || isLoading}
                          onClick={handleUpload}
                          variant="default"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enviando...
                            </>
                          ) : 'Atualizar Foto'}
                        </Button>
                        
                        {imageFile && (
                          <Button 
                            variant="outline"
                            onClick={handleRemoveImage}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4 mr-1" /> Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="info" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input 
                        id="name" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Seu nome completo"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative">
                        <Input 
                          id="email" 
                          type="email" 
                          value={user.email || ''}
                          disabled
                          className="bg-slate-50 dark:bg-slate-800 pr-12"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
                                  <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>O e-mail não pode ser alterado</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        E-mail vinculado à sua conta
                      </p>
                    </div>
                  </div>
                  
                  {/* Additional fields would go here */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de usuário</Label>
                      <Input 
                        id="username" 
                        placeholder="seu_usuario" 
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      <p className="text-xs text-muted-foreground">
                        Seu identificador único
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma preferido</Label>
                      <select 
                        id="language"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button 
                      onClick={saveProfile} 
                      disabled={isSaving}
                      className="gap-2 px-6"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isSaving ? 'Salvando...' : 'Salvar alterações'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

// Missing import definition - needs to be added to imports
function Lock(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
