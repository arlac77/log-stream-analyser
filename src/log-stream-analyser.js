/**
 *
 */
export class LogStreamAnalyser {
  constructor() {}

  async addStream(stream) {
    stream.setEncoding('utf8');

    //console.log(stream);
    //console.log(stream[Symbol.asyncIterator]);
    const i = stream[Symbol.asyncIterator]();
    //console.log(i);
    const r = await i.next();
    console.log(r);
    /*
    for await (const chunk of stream) {
      console.log(chunk);
    }
    */
  }
}
