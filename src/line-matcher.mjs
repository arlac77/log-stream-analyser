


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

export const SystemLogMatcher = {
  regex : /^(?<month>\w+)\s+(?<mday>\d+)\s+(?<hours>\d+):(?<minutes>\d+):(?<seconds>\d+)\s+(?<host>[\-\.\w]+)\s+(?<process>[\w_]+)\[(?<pid>\d+)\]:\s+((?<scope>\w+):\s+)?(?<message>.*)/,
  process(match,analyser) {
    return {
      date: new Date(
        analyser.referenceDate.getFullYear(),
        m2n[match.groups.month],
        match.groups.mday,
        match.groups.hours,
        match.groups.minutes,
        match.groups.seconds
      ),
      host: match.groups.host,
      scope: match.groups.scope,
      process: match.groups.process,
      pid: parseInt(match.groups.pid,10),
      message: match.groups.message
    };
  }
};
