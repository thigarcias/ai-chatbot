import { cx } from "class-variance-authority"
import { FileText } from "lucide-react"
import { Dispatch, memo, SetStateAction } from "react"
import { Button } from "../ui/button"

export interface ArtifactOptions {
    enabled: boolean
}

function PureDocumentToolsButton({ 
    artifactOptions, 
    setArtifactOptions, 
    isLoading 
  }: { 
    artifactOptions: ArtifactOptions, 
    setArtifactOptions: Dispatch<SetStateAction<ArtifactOptions>>, 
    isLoading: boolean 
  }) {
    const toggleArtifacts = () => {
      setArtifactOptions(prev => ({ enabled: !prev.enabled }))
    }
  
    return (
      <Button
        type="button"
        className={cx(
          "rounded-md p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200",
          artifactOptions.enabled && "bg-blue-100 dark:bg-blue-900"
        )}
        variant="ghost"
        disabled={isLoading}
        onClick={toggleArtifacts}
        title={artifactOptions.enabled ? "Document tools enabled" : "Document tools disabled"}
      >
        <FileText size={14} />
      </Button>
    )
}

export const DocumentToolsButton = memo(PureDocumentToolsButton)

