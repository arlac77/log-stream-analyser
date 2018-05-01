/**
 *
 */
export class LogStreamAnalyser {
  constructor() {
    this[Symbol.asyncIterator] = async function() {
      return {
        async next() {
          return { done: true };
        }
      };
    };
  }

  async addStream(stream) {
    stream.setEncoding('utf8');

    //console.log(stream);
    //console.log(stream[Symbol.asyncIterator]);
    const i = stream[Symbol.asyncIterator]();
    //console.log(i);
    const r = await i.next();
    console.log(r.value);
    /*
    for await (const chunk of stream) {
      console.log(chunk);
    }
    */
  }
}
