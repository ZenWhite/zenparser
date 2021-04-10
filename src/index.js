import cheerio from 'cheerio'
import chalk from 'chalk'

import { getPageContent } from './utils/getPageContent.js'

const URL = 'https://lcsc.com/products/Cables-Wires_328.html';

(async function main() {
    try {
        const pageContent = await getPageContent(URL)
        console.log( chalk.green(pageContent) )
    } catch(err) {
        console.log( chalk.red('Что-то пошло не так!\n') )
        console.log(err)
    }
})()