import cheerio from 'cheerio'

import { getPageContent } from './getPageContent.js'

export const getLinks = async (url, selector) => {
    const pageContent = await getPageContent(url)

    const $ = cheerio.load(pageContent)
    
    return $(selector).map( (_, elem) => $(elem).attr('href') ).get()
}