/**
 *
 */
export class LogStreamAnalyser {
  async *process(stream) {
    for await (const chunk of stream) {
      const lines = chunk.split(/\r?\n/);
      for (const line of lines) {
        const m = line.match(
          /^(?<month>\w+)\s+(?<mday>\d+)\s+(?<hours>\d+):(?<minutes>\d+):(?<seconds>\d+)\s+(?<host>\w+)\s+(?<message>.*)/
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
            date: new Date(
              2018,
              m2n[m.groups.month],
              m.groups.mday,
              m.groups.hours,
              m.groups.minutes,
              m.groups.seconds
            ),
            host: m.groups.host,
            message: m.groups.message
          };
        }
      }
    }
  }
}
