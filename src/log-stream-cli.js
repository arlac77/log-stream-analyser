const { createReadStream } = require('fs');
const { join } = require('path');
import { LogStreamAggregator } from './log-stream-aggregator';
import { LogStreamAnalyser } from './log-stream-analyser';

async function ab() {
  const lsa = new LogStreamAggregator();

  lsa.addSource(
    createReadStream(
      join(__dirname, '..', 'tests', 'fixtures', 'install.log.txt')
    ),
    new LogStreamAnalyser()
  );

  for await (const e of lsa) {
    console.log(`event:${JSON.stringify(e)}`);
  }
}

ab();
