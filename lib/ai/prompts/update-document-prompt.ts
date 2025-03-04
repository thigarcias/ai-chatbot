import { ArtifactKind } from '@/components/artifact'

export const updateDocumentPrompt = (
    currentContent: string | null,
    type: ArtifactKind,
  ) =>
    type === 'text'
      ? `\
  Melhore o seguinte conteúdo do documento com base no prompt fornecido.
  
  ${currentContent}
  `
      : type === 'code'
        ? `\
  Melhore o seguinte trecho de código com base no prompt fornecido.
  
  ${currentContent}
  `
        : type === 'sheet'
          ? `\
  Melhore a seguinte planilha com base no prompt fornecido.
  
  ${currentContent}
  `
          : ''