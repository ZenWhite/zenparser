import cheerio from 'cheerio'
import chalk from 'chalk'

import { getPageContent } from './utils/getPageContent.js'
import { getLinks } from './utils/getLinks.js'
import { saveData } from './handlers/saveData.js'
import { slugify } from 'transliteration'

const URL = 'https://lcsc.com';

(async function main() {
    try {
        const categories = await getLinks(`${URL}/products`, '.type-title')
        const links = categories.map(category => URL + category)

        links.forEach(async (link) => {
            const fileName = slugify(link.split('.html')[0])
            const pageContent = await getPageContent(link)
            const $ = cheerio.load(pageContent)

            const detailsList = $('tr').map((_, elem) => ({
                partnumber: $(elem).find('.template-mpn a').text(),
                link: $(elem).find('.product-pdf').attr('href'),
                description: $(elem).find('.description-title').text(),
                manufacturer: $(elem).find('.brand-title').text(),
                price: $('.product-price-panel-discount:first-child').text(),
                availability: $(elem).find('.avali-stock-num').text()
            })).get().filter(item => item.partnumber)

            saveData(detailsList, fileName)
        })

        console.log( chalk.green('Сбор данных завершён') )
    } catch (err) {
        console.log(chalk.red('Что-то пошло не так!\n'))
        console.log(err)
    }
})()