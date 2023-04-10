const rollup = require('rollup');
const path = require('path');
const fs = require('fs');
const test = require('ava');
const { default: compiler } = require('../../transpile/index');
async function compile() {
  const rollupConfig = {
    input: 'test/aggregating-export/fixtures/re-export.js',
    output: {
      format: 'esm',
      dir: 'lib',
      preserveModules: true,
    },
    plugins: [compiler()],
  };
  const bundle = await rollup.rollup(rollupConfig);
  const bundles = await bundle.generate(rollupConfig.output);
  return bundles.output;
}

async function testReExport() {
  const output = await compile();
  const code = output.find((ele) => ele.fileName === 're-export.js').code;
  const minified = await fs.promises.readFile('test/aggregating-export/fixtures/re-export.esm.default.js', 'utf8');
  test('re-export works correctly with ', (t) => {
    t.is(code, minified);
  });
}
testReExport();

// import { generator, defaultClosureFlags } from '../generator';

// generator('aggregating-export', 're-export', false, ['esm'], defaultClosureFlags, null, null, {
//     format: 'esm',
//     dir: 'lib',
//     preserveModules: true,
// });
