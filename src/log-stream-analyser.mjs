import { SystemLogMatcher } from './line-matcher';


/**
 *
 */
export class LogStreamAnalyser {
  constructor(recordSeparator = /\r?\n/) {
    Object.defineProperties(this, {
      referenceDate: { value: new Date() },
      recordSeparator: { value: recordSeparator }
    });
  }

  async *process(stream) {

    const matcher = [ SystemLogMatcher ];

    for await (const chunk of stream) {
      for (const line of chunk.split(this.recordSeparator)) {

        for(const lm of matcher) {
          const match = line.match(lm.regex);
          if(match) {
            yield lm.process(match, this);
          }
        }

        //console.log(`unknown line '${line}'`);
      }
    }
  }
}
