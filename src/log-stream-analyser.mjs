const { createReadStream } = require('fs');
const { join } = require('path');

/**
 *
 */
class LogStreamAnalyser {
  constructor() {
    Object.defineProperties(this, { sources: { value: [] } });
  }

  async *[Symbol.asyncIterator]() {
    const sources = this.sources;

    for (const stream of sources) {
      const i = stream[Symbol.asyncIterator]();
      const r = await i.next();
      if (r.done === false) {
        const lines = r.value.split(/\r?\n/);
        for (const line of lines) {
          const m = line.match(
            /^(\w+)\s+(\d+)\s+(\d+):(\d+):(\d+)\s+(\w+)\s+(.*)/
          );
          if (m) {
            const m2n = {
              Jan: 0,
              Feb: 1,
              Mar: 2,
              Apr: 3,
              May: 4,
              Jun: 5,
              Jul: 6,
              Aug: 7,
              Sep: 8,
              Oct: 9,
              Nov: 10,
              Dec: 11
            };
            yield {
              date: new Date(2018, m2n[m[1]], m[2], m[3], m[4], m[5]),
              host: m[6],
              message: m[7]
            };
          }
        }
      }
    }
  }

  addSource(stream) {
    stream.setEncoding('utf8');

    this.sources.push(stream);
  }
}

async function ab() {
  const lsa = new LogStreamAnalyser();
  lsa.addSource(
    createReadStream(join(__dirname, '..', 'tests', 'fixtures', 'install.log'))
  );

  for await (const e of lsa) {
    console.log(`event:${JSON.stringify(e)}`);
  }
}

ab();
