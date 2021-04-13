import cheerio from 'cheerio'
import chalk from 'chalk'

import { getPageContent } from './utils/getPageContent.js'
import { getLinks } from './utils/getLinks.js'
import { saveData } from './handlers/saveData.js'

const main = async () => {
    const url = 'https://lcsc.com'

    try {
        const categories = await getLinks(`${url}/products`, '.type-title') // /products/Amplifiers_515.html
        const links = [ categories.map(category => url + category)[0] ]

        const constraint = {}

        Promise.all(links.map((link) => getPageContent(link))).then(page => {
            const $ = cheerio.load(page)

            constraint[$('h1').text()] = Number($('.layui-laypage-last').attr("data-page"))
        })

        console.log(constraint)

        /*Promise.all(links.map((link) => getPageContent(link))).then(contents => {
            const data = contents.map((content) => {
                const $ = cheerio.load(content)

                const limit = $('.layui-laypage-last').attr("data-page")

                // get text from NODE -> check text for value in step

                // click -> await render -> await parse

                const parsed = $('tr').map((_, elem) => ({
                        partnumber: $(elem).find('.template-mpn a').text(),
                        link: $(elem).find('.product-pdf').attr('href'),
                        description: $(elem).find('.description-title').text(),
                        manufacturer: $(elem).find('.brand-title').text(),
                        price: '',
                        availability: $(elem).find('.avali-stock-num').text()
                    })).get().filter(item => item?.partnumber)

                return parsed.reduce((acc, curr) => ({ ...acc, [curr.partnumber]: curr }), {})
            }, {}).reduce((acc, curr, index) => ({ ...acc, [index]: curr }), {})

            saveData(data, 'data')
        })*/

    } catch (err) {
        console.log(chalk.red('Что-то пошло не так!\n'))
        console.log(err)
    }
}

main()