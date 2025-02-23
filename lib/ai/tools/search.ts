import { tool } from 'ai'
import { z } from 'zod'
import axios from 'axios'

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

    if (response.status !== 200) {
      throw new Error('Error searching the web')
    }

    const searchData = response.data

    return searchData
  },
})
