/**
 *
 */
export class LogStreamAnalyser {
  constructor() {
    Object.defineProperties(this, { sources: { value: [] } });
  }

  [Symbol.asyncIterator]() {
    const sources = this.sources;
    return {
      async next() {
        for (const stream of sources) {
          const i = stream[Symbol.asyncIterator]();
          const r = await i.next();
          if (r.done === false) {
            return { done: false, value: r.value };
          }
        }

        return { done: true };
      }
    };
  }

  async addSource(stream) {
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
