import path from 'path'
import fs from 'fs'
import chalk from 'chalk'

export const saveData = async (data) => {
    const savePath = path.resolve('./src/data/data.json')
    const dataForWrite = {}
    data.forEach((dataItem, i) => dataForWrite[i] = dataItem)

    return new Promise((resolve, reject) => {
        fs.writeFile(savePath, JSON.stringify(dataForWrite), err => {
            if(err) return reject(err)

            console.log( chalk.blue( 'Создание и сохранение файла с данными прошло успешно!' ) )

            resolve()
        })
    })
}