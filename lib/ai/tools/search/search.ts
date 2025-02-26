import { tool } from 'ai'
import { z } from 'zod'
import axios from 'axios'
import scrapeUrl from './scrape'

// Define interface for Brave Search API result
interface BraveSearchResult {
  title: string
  url: string
  description: string
  is_source_local: boolean
  is_source_both: boolean
  language: string
  family_friendly: boolean
  type: string
  subtype: string
  is_live: boolean
  profile?: {
    name: string
    url: string
    long_name: string
    img: string
  }
  meta_url: {
    scheme: string
    netloc: string
    hostname: string
    favicon: string
    path: string
  }
  thumbnail?: {
    src: string
    original: string
    logo: boolean
  }
  flaticon?: string
}

// Define interface for search response
interface SearchResponse {
  web: {
    results: BraveSearchResult[]
  }
}

// Define interface for processed result returned to user
// Aligned with what SourcesView component expects
export interface Source {
  url: string
  title: string
  description: string
  favicon?: string // Changed from flaticon to match frontend naming
  content?: string
  siteName?: string // Added for frontend display
}

const getSiteContent = async (url: string) => {
  try {
    const data = await scrapeUrl({ url })
    return data?.content
  } catch (error) {
    console.error('Erro ao buscar conteúdo do site:', error)
    return ''
  }
}

export const search = tool({
  description: 'Search the web for information',
  parameters: z.object({
    query: z.string().describe('The query to search for'),
    useScrape: z.boolean().default(false).describe('Scrape the content of the website, use to deep search'),
    numberOfResults: z.number().min(1).max(10).describe('The number of results to return, max 10')
  }),
  execute: async ({ query, useScrape, numberOfResults }) => {
    const response = await axios.get<SearchResponse>(`https://api.search.brave.com/res/v1/web/search?q=${query}`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY,
      },
    })

    const parsedData = JSON.parse(JSON.stringify(response.data))
    
    const results: Source[] = await Promise.all(
      parsedData.web.results.slice(0, numberOfResults).map(async (result: BraveSearchResult) => {
        const content = useScrape ? await getSiteContent(result.url) : ''
        return {
          url: result.url,
          title: result.title,
          description: result.description,
          favicon: result.meta_url?.favicon || result.flaticon, // Prefer meta_url.favicon, fallback to flaticon
          siteName: result.profile?.name || new URL(result.url).hostname, // Extract site name from profile or URL
          content
        }
      })
    )

    console.log('Search results:', results)

    if (response.status !== 200) {
      throw new Error('Error searching the web')  
    }

    return results
  },
})
