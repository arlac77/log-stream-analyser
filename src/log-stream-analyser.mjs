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
        yield r.value;
      }
    }
  }

  /*
  async *[Symbol.asyncIterator]() {
    const sources = this.sources;
    return {
      async next() {
        for (const stream of sources) {
          const i = stream[Symbol.asyncIterator]();
          const r = await i.next();
          if (r.done === false) {
            //const lines = r.value.split(/\r?\n/);

            return { done: false, value: r.value };
          }
        }

        return { done: true };
      }
    };
  }
*/

  addSource(stream) {
    stream.setEncoding('utf8');

    this.sources.push(stream);

    //console.log(stream);
    //console.log(stream[Symbol.asyncIterator]);

    /*
    const i = stream[Symbol.asyncIterator]();
    const r = await i.next();
    console.log(r.value);
*/
    /*
    for await (const chunk of stream) {
      console.log(chunk);
    }
    */
  }
}

async function ab() {
  const lsa = new LogStreamAnalyser();
  //lsa.addSource(process.stdin);
  lsa.addSource(
    createReadStream(join(__dirname, '..', 'tests', 'fixtures', 'install.log'))
  );

  for await (const e of lsa) {
    console.log(e);
  }
}

ab();
