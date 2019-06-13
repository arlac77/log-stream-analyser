import { SystemLogMatcher } from './line-matcher.mjs';


/**
 *
 */
export class LogStreamAnalyser {
  constructor(lineMatcher=[SystemLogMatcher],recordSeparator = /\r?\n/) {
    Object.defineProperties(this, {
      referenceDate: { value: new Date() },
      lineMatcher: { value: lineMatcher },
      recordSeparator: { value: recordSeparator }
    });
  }

  async *process(stream) {
    for await (const chunk of stream) {
      for (const line of chunk.split(this.recordSeparator)) {

        for(const lm of this.lineMatcher) {
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
