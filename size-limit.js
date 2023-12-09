import brotli from 'brotli';
import { gzip } from 'node-gzip';
import fs from 'node:fs';

fs.writeFileSync('index.min.br', brotli.compress(fs.readFileSync('index.min.js')));
fs.writeFileSync('index.min.gz', await gzip(fs.readFileSync('index.min.js').toString()));