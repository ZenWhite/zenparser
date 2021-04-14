import path from 'path'
import fs from 'fs'
import chalk from 'chalk'

export const saveData = async (data, fileName) => {
  const pathname = path.resolve(`./src/data/${fileName}.json`)

  fs.writeFile(pathname, JSON.stringify(data), 'utf8', (err) => {
    if (err) return null
    console.log(chalk.blue('Сохранение данных прошло успешно'))
  })
}
