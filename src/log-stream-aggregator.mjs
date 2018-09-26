/**
 * @property {Object[]} sources
 */
export class LogStreamAggregator {
  constructor() {
    Object.defineProperties(this, { sources: { value: [] } });
  }

  async *[Symbol.asyncIterator]() {
    for (const source of this.sources) {
      for await (const event of source.analyser.process(source.stream)) {
        yield event;
      }
    }
  }

  /**
   * @param {ReadableStream} stream
   * @param {LogStreamAnalyster} analyser
   */
  addSource(stream, analyser) {
    stream.setEncoding("utf8");
    this.sources.push({ stream, analyser });
  }
}
