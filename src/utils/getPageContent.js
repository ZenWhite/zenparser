import puppeteer from 'puppeteer'

const range = (x) =>
  new Array(x)
    .fill()
    .map((_, i) => ++i)
    .splice(1, x)

export const LAUNCH_PUPPETEER_OPTS = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080'
  ]
}

export const PAGE_PUPPETEER_OPTS = {
  networkIdle2Timeout: 5000,
  waitUntil: 'networkidle2',
  timeout: 10000000
}

export const getPage = async (url, amount) => {
  const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)

  const page = await browser.newPage()

  const go = async (amount) => {
    await page.goto(url, PAGE_PUPPETEER_OPTS)

    if (amount) {
      const contents = []

      for (const n of range(amount)) {
        await page.waitForSelector(`a[data-page="${n}"]`)

        await page.click(`a[data-page="${n}"]`)
  
        await page.waitForResponse('https://lcsc.com/api/products/search')

        const content = await page.content()

        contents.push(content)
      }

      return contents
    } else {
      const content = await page.content()

      return content
    }
  }

  const content = amount ? await go(amount) : await go()

  browser.close()

  return content
}
