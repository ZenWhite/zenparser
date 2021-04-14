import cheerio from 'cheerio'

import { getPage } from './getPageContent.js'

export const getLinks = async (url, selector) => {
    const page = await getPage(url)

    const $ = cheerio.load(page)
    
    return $(selector).map( (_, elem) => $(elem).attr('href') ).get()
}