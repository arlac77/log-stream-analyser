import test from 'ava';
import { join } from 'path';
import { createReadStream } from 'fs';
import { LogStreamAnalyser } from '../src/log-stream-analyser';

test('install.log', async t => {
  const lsa = new LogStreamAnalyser();

  lsa.addStream(
    createReadStream(join(__dirname, '..', 'tests', 'fixtures', 'install.log'))
  );

  /*
  for await (const e of lsa) {
    t.is(e.hostname, 'pro');
  }
  */
});
