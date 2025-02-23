import { tool } from 'ai'
import { z } from 'zod'
import axios from 'axios'

const getSiteContent = async (url: string) => {
  const completeUrl = `https://r.jina.ai/${url}`
  const response = await axios.get(completeUrl, {
    headers: {
      'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
      'Accept': 'text/html',
    },
  })
  return response.data
}

export const search = tool({
  description: 'Search the web for information',
  parameters: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    const response = await axios.get(`https://api.search.brave.com/res/v1/web/search?q=${query}`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY,
      },
    })

    const parsedData = JSON.parse(JSON.stringify(response.data))
    const results = parsedData.web.results.map((result: any) => ({
      url: result.url,
      title: result.title,
      description: result.description,
      content: getSiteContent(result.url),
    }))

    if (response.status !== 200) {
      throw new Error('Error searching the web')
    }

    return results[0]
  },
})
