import axios from 'axios'
import * as cheerio from 'cheerio'

export type ScrapeResult = {
    content: string | null,
    urls: (string | undefined)[]
}

export async function scrapeUrl(params: { url: string }): Promise<ScrapeResult | null> {
  const { url } = params

  const response = await axios.get(
    url,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0'
      }
    }
  )

    const $ = cheerio.load(response.data)

    const elementsToRemove = [
      'script', 'style', 'noscript', 'iframe', 'img', 'svg', 'button',
      'input', 'form', 'textarea', 'select', 'label', 'nav', 'header',
      'footer', 'aside', 'video', 'audio', 'canvas', 'map', 'object',
      'embed', 'param', 'picture', 'source', 'track', 'area', 'circle',
      'rect', 'polygon', 'use', 'option', 'datalist', 'optgroup', 'fieldset', 'legend',
      'progress', 'meter', 'details', 'summary', 'menuitem', 'menu',
      'dialog'
    ]

    const images = $('img').toArray()
    const urls = images.map(element => $(element).attr('src'))
    elementsToRemove.forEach(element => $(element).remove())

    const textContents = $('body').text()
    const cleanContents = textContents.replace(/\s+/g, ' ').trim()

    return { content: cleanContents, urls }
}

export default scrapeUrl