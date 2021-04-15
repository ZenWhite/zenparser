import cheerio from 'cheerio'
import chalk from 'chalk'

import { getPage } from './utils/getPageContent.js'
import { getLinks } from './utils/getLinks.js'
import { saveData } from './handlers/saveData.js'

const main = async () => {
    const url = 'https://lcsc.com'

    try {
        const categories = await getLinks(`${url}/products`, '.type-title')
        const links = categories.map((category) => url + category)

        let formatted = {}

        for (const link of links) {
            const page = await getPage(link)

            const $ = cheerio.load(page)

            const category = $('h1').text()
            const amount = Number($('.layui-laypage-last').attr('data-page'))

            const paginated = await getPage(link, amount)

            const data = [page, ...paginated]
                .map((html) => {
                    const $ = cheerio.load(html)

                    const getPrice = (elem) => {
                        return $(elem).find('.product-price-panel').map( (_, el) => {
                            const num = $(el).find('.product-price-panel-num').text()
                            const price = $(el).find('.product-price-panel-unit').text()
                            return `${num} ${price}`.replace(/[\n\s]/g, '')
                        } ).get().reduce((acc, curr) => `${acc}${curr}\n`, '')
                    }

                    return $('tr')
                        .map((_, elem) => ({
                            partnumber: $(elem).find('.template-mpn a').text(),
                            link: $(elem).find('.product-pdf').attr('href'),
                            description: $(elem).find('.description-title').text(),
                            manufacturer: $(elem).find('.brand-title').text(),
                            price: getPrice(elem),
                            availability: $(elem).find('.avali-stock-num').text()
                        }))
                        .get()
                        .filter((item) => item?.partnumber && +item.availability)
                        .reduce((acc, curr) => ({ ...acc, [curr.partnumber]: curr }), {})
                })
                .reduce((acc, curr) => ({ ...acc, [category]: [...acc[category], curr] }), { [category]: [] })

            formatted = { ...formatted, ...data }
        }

        saveData(formatted, 'data')
    } catch (err) {
        console.log(chalk.red('Что-то пошло не так!\n'))
        console.error(err)
    }
}

main()
