import { tool } from 'ai'
import { z } from 'zod'

export const search = tool({
  description: 'Search the web for information',
  parameters: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    const response = await fetch(`https://s.jina.ai/${query}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer jina_359925822258467696153bdfdd6d03b09-e3ERQ8zp0XnBSl4vrEtR1J_G-g',
        'X-Engine': 'direct',
        'X-Retain-Images': 'none',
      },
    })

    if (!response.ok) {
      throw new Error('Error searching the web')
    }

    const searchData = await response.text()

    return searchData
  },
})
