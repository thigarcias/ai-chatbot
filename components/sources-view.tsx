'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, ExternalLink, Globe, AlertCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

interface Source {
  name?: string
  title: string
  description: string
  icon?: string
  url?: string
  favicon?: string
}

interface SourcesViewProps {
  sources: Source[]
  isLoading?: boolean
}

export const SourcesView: React.FC<SourcesViewProps> = ({ 
  sources = [],
  isLoading = false 
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedSourceIndex, setSelectedSourceIndex] = useState<number>(0)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!modalIsOpen) return
      
      switch (event.key) {
        case 'Escape':
          closeModal()
          break
        case 'ArrowLeft':
          setSelectedSourceIndex(prev => 
            prev > 0 ? prev - 1 : sources.length - 1)
          break
        case 'ArrowRight':
          setSelectedSourceIndex(prev => 
            prev < sources.length - 1 ? prev + 1 : 0)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalIsOpen, sources.length])

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal()
      }
    }
    
    if (modalIsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalIsOpen])

  const openModal = (index: number = 0) => {
    setSelectedSourceIndex(index)
    setModalIsOpen(true)
    // Lock body scroll
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setModalIsOpen(false)
    // Restore body scroll
    document.body.style.overflow = 'auto'
  }

  const getIconForSource = (source: Source) => {
    if (source.favicon) {
      return (
        <Image 
          src={source.favicon} 
          alt={`${source.name} favicon`} 
          width={16} 
          height={16} 
          className="rounded-sm"
        />
      )
    }
    
    return <Globe className="h-4 w-4" />
  }
  
  // Show empty or loading state
  if (isLoading) {
    return (
      <div className="w-full p-3 rounded-lg animate-pulse">
        <div className="h-6 rounded w-36"></div>
      </div>
    )
  }
  
  if (!sources || sources.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      {/* Sources Preview Bar */}
      <div 
        onClick={() => openModal(0)} 
        className="flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors border"
        role="button"
        aria-label="Ver fontes de informação"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openModal(0)}
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fontes:</span>
        <div className="flex flex-wrap gap-2">
          {sources.slice(0, 5).map((source, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center w-6 h-6 rounded-full shadow-sm hover:shadow-md transition-shadow"
              title={source.name}
            >
              <div className="text-gray-600 dark:text-gray-300">
                {getIconForSource(source)}
              </div>
            </div>
          ))}
          {sources.length > 5 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full">
              +{sources.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Modal with Animation */}
      <AnimatePresence>
        {modalIsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/85 dark:bg-black/90"
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl border bg-white dark:bg-black"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Fontes de informação ({sources.length})
                </h2>
                <button 
                  onClick={closeModal}
                  className="p-1 rounded-full transition-colors"
                  aria-label="Fechar modal"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              {/* Source Navigation */}
              <div className="flex overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {sources.map((source, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSourceIndex(index)}
                    className={`px-3 py-2 whitespace-nowrap rounded-md mr-1 text-sm font-medium transition-colors ${
                      selectedSourceIndex === index 
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 w-fit justify-center">
                      <div className="flex-shrink-0">
                        {getIconForSource(source)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Selected Source Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {sources[selectedSourceIndex] && (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm">
                            {getIconForSource(sources[selectedSourceIndex])}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {sources[selectedSourceIndex].name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {sources[selectedSourceIndex].title}
                            </p>
                          </div>
                        </div>
                        
                        {sources[selectedSourceIndex].url && (
                          <a 
                            href={sources[selectedSourceIndex].url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Visitar
                          </a>
                        )}
                      </div>
                      
                      <div className="prose max-w-none dark:prose-invert prose-gray prose-sm">
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                          {sources[selectedSourceIndex].description || (
                            <span className="text-gray-500 italic flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              Sem descrição disponível
                            </span>
                          )}
                        </p>
                      </div>
                      
                      {/* Source Navigation Buttons */}
                      <div className="flex justify-between mt-8 pt-4 border-t">
                        <button
                          onClick={() => setSelectedSourceIndex(prev => 
                            prev > 0 ? prev - 1 : sources.length - 1
                          )}
                          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          disabled={sources.length <= 1}
                        >
                          Anterior
                        </button>
                        <span className="text-sm text-gray-500">
                          {selectedSourceIndex + 1} de {sources.length}
                        </span>
                        <button
                          onClick={() => setSelectedSourceIndex(prev => 
                            prev < sources.length - 1 ? prev + 1 : 0
                          )}
                          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          disabled={sources.length <= 1}
                        >
                          Próximo
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
