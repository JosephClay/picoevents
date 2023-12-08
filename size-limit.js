import * as br from 'brotli-compress';
import { readFile, writeFile } from 'node:fs/promises';

const file = await readFile('index.min.js');
const compressed = await br.default.compress(file.toString());
await writeFile('index.min.br', compressed);