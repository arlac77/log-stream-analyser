/**
 *
 */
export class LogStreamAnalyser {
  async *process(stream) {
    for await (const chunk of stream) {
      const lines = chunk.split(/\r?\n/);
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
