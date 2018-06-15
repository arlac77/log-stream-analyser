import test from 'ava';
import { join } from 'path';
import { createReadStream } from 'fs';
import { LogStreamAnalyser } from '../src/log-stream-analyser';

test('install.log', async t => {
  const lsa = new LogStreamAnalyser();

  lsa.addSource(
    createReadStream(
      join(__dirname, '..', 'tests', 'fixtures', 'install.log.txt')
    )
  );

  /*
  for await (const e of lsa) {
    t.is(e.hostname, 'pro');
  }
  */

  const eventIter = await lsa[Symbol.asyncIterator]();

  const event = (await eventIter.next()).value;

  t.deepEqual(event, {
    date: 'Sep 24 22:04:14',
    hostname: 'pro',
    message:
      'softwareupdate_firstrun_tasks[63]: Host swscan.apple.com isReachable = YES'
  });
});
