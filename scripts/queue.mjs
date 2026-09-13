import { build } from 'esbuild'
import { unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const out = join(tmpdir(), `q-${Date.now()}.mjs`)
await build({
  stdin: { contents: `export { opportunities } from './src/derive.ts'`, resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent',
})
const { opportunities } = await import(pathToFileURL(out).href)
unlinkSync(out)

const n = Number(process.argv[2] ?? 20)
opportunities.slice(0, n).forEach((o, i) => {
  console.log(`${String(i + 1).padStart(2)}. ${o.partner.name} -> ${o.fit.labId}   [intro: ${o.introducers.join(', ')}]${o.fit.reviewed ? '' : '  (UNREVIEWED)'}`)
  console.log(`    ${o.fit.reasoning}`)
})
console.log('\ntotal opportunities: ' + opportunities.length)
