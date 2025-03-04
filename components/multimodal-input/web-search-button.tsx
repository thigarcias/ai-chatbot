import { Label } from "@radix-ui/react-label"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { Switch } from "@radix-ui/react-switch"
import { cx } from "class-variance-authority"
import { Globe } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export interface SearchOptions {
    enabled: boolean
    deepResearch: boolean
    numberOfSources: number
}  

export function WebSearchButton({ 
    searchOptions, 
    setSearchOptions, 
    isLoading 
  }: { 
    searchOptions: SearchOptions, 
    setSearchOptions: Dispatch<SetStateAction<SearchOptions>>, 
    isLoading: boolean 
  }) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cx(
              "rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200",
              searchOptions.enabled && "bg-blue-100 dark:bg-blue-900"
            )}
            variant="ghost"
            disabled={isLoading}
          >
            <Globe />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3">
          <div className="space-y-3">
            <h4 className="font-medium leading-none mb-2">Web Search</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="search-enabled" className="text-sm">Enable Search</Label>
              <Switch 
                id="search-enabled" 
                checked={searchOptions.enabled}
                onCheckedChange={(checked) => 
                  setSearchOptions(prev => ({ ...prev, enabled: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="deep-research" 
                className={cx("text-sm", !searchOptions.enabled && "text-gray-400")}
              >
                Deep Research
              </Label>
              <Switch 
                id="deep-research" 
                disabled={!searchOptions.enabled}
                checked={searchOptions.deepResearch}
                onCheckedChange={(checked) => 
                  setSearchOptions(prev => ({ ...prev, deepResearch: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="sources-count" 
                className={cx("text-sm", !searchOptions.enabled && "text-gray-400")}
              >
                Number of Sources
              </Label>
              <Input 
                id="sources-count"
                type="number"
                min={1}
                max={10}
                disabled={!searchOptions.enabled}
                value={searchOptions.numberOfSources}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (isNaN(value)) return;
                  
                  // Clamp value between 1 and 10
                  const clampedValue = Math.min(Math.max(value, 1), 10);
                  setSearchOptions(prev => ({ ...prev, numberOfSources: clampedValue }));
                }}
                className="w-16 h-8 text-center"
              />
            </div>
            
            {searchOptions.enabled && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {searchOptions.deepResearch 
                  ? `Deep research analyzes ${searchOptions.numberOfSources} sources.` 
                  : `Basic search from ${searchOptions.numberOfSources} sources.`}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
}