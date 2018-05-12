/**
 *
 */
export class LogStreamAggregator {
  constructor() {
    Object.defineProperties(this, { sources: { value: [] } });
  }

  async *[Symbol.asyncIterator]() {
    for (const source of this.sources) {
      for await (const chunk of source.stream) {
        for await (const event of source.analyser.process(chunk)) {
          yield event;
        }
      }
    }
  }

  addSource(stream, analyser) {
    stream.setEncoding('utf8');
    this.sources.push({ stream, analyser });
  }
}
