import path from 'path'
import { readdir, readFile } from 'fs/promises'

const paths = {
    dir: path.resolve('./src/data/'),
    file: (name) => path.resolve(`./src/data/${name}`)
}

const load = async () => {
    const filenames = await readdir(paths.dir)

    for await (const file of filenames.map((x) => readFile(paths.file(x), 'utf-8'))) {}
}

load()
    .then(() => console.log('\ndone'))
    .catch((err) => console.error('\n' + err))