import cheerio from 'cheerio'
import chalk from 'chalk'

import { getPageContent } from './utils/getPageContent.js'
import { saveData } from './handlers/saveData.js'

const URL = 'https://lcsc.com/products/Cables-Wires_328.html'; //CATEGORIES: string[]

(async function main() {
    try {
        const pageContent = await getPageContent(URL)
        const $ = cheerio.load(pageContent)
        
        const detailsList = $('tr').map((_, elem) => ({
            partnumber: $(elem).find('.template-mpn a').text(),
            link: $(elem).find('.product-pdf').attr('href'),
            description: $(elem).find('.description-title').text(),
            manufacturer: $(elem).find('.brand-title').text(),
            price: $('.product-price-panel-discount:first-child').text(),
            availability: $(elem).find('.avali-stock-num').text()
        })).get().filter(item => item.partnumber && item.availability != 0)

        saveData(detailsList)
    } catch(err) {
        console.log( chalk.red('Что-то пошло не так!\n') )
        console.log(err)
    }
})()