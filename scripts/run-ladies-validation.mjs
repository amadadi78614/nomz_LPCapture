import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const dir = await mkdtemp(join(tmpdir(), 'lp-ladies-'));
try {
  const outfile = join(dir, 'check.mjs');
  await build({ entryPoints: ['scripts/validate-ladies-october.js'], bundle: true, platform: 'node', format: 'esm', outfile });
  await import(pathToFileURL(outfile).href);
} finally { await rm(dir, { recursive: true, force: true }); }
