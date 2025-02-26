import { tool } from 'ai'
import { z } from 'zod'
import axios from 'axios'
import scrapeUrl from './scrape'

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
    numberOfResults: z.number().min(1).max(10).default(5).describe('The number of results to return, max 10'),
  }),
  execute: async ({ query, useScrape, numberOfResults }) => {
    const response = await axios.get(`https://api.search.brave.com/res/v1/web/search?q=${query}`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY,
      },
    })

    const parsedData = JSON.parse(JSON.stringify(response.data))
    
    const results = await Promise.all(parsedData.web.results.slice(0, numberOfResults).map(async (result: any) => {
      const content = useScrape ? await getSiteContent(result.url) : ''
      return {
        url: result.url,
        title: result.title,
        description: result.description,
        flaticon: result.flaticon,
        content
      }
    }))

    if (response.status !== 200) {
      throw new Error('Error searching the web')  
    }

    console.log(results, 'results search.ts')
    return results
  },
})
