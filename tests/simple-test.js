import test from 'ava';
import { join } from 'path';
import { createReadStream } from 'file';

test('install.log', async t => {
  const lsa = new LogStreamAnalyser();

  lsa.addInput(
    createReadStream(join(__dirname, '..', 'tests', 'fixtures', 'install.log'))
  );

  for (async const e of lsa) {
    t.is(e.hostname,'pro');
  }

});
