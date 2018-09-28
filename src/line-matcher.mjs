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
  regex: /^(?<month>\w+)\s+(?<mday>\d+)\s+(?<hours>\d+):(?<minutes>\d+):(?<seconds>\d+)\s+(?<host>[\-\.\w]+)\s+(?<process>[\w_]+)\[(?<pid>\d+)\]:\s+((?<scope>\w+):\s+)?(?<message>.*)/,
  process: (match, analyser) =>
    ["host", "scope", "process", "message"].reduce(
      (acc, name) => {
        if (match.groups[name] !== undefined) {
          acc[name] = match.groups[name];
        }
        return acc;
      },
      {
        date: new Date(
          analyser.referenceDate.getFullYear(),
          m2n[match.groups.month],
          match.groups.mday,
          match.groups.hours,
          match.groups.minutes,
          match.groups.seconds
        ),
        pid: parseInt(match.groups.pid, 10)
      }
    )
};

export const PacmanLogMatcher = {
  regex: /^\[(?<year>\d+)-(?<month>\d+)-(?<day>\d+)\s+(?<hours>\d+):(?<minutes>\d+)\]\s+\[(?<process>[\w_]+)\]\s+(?<message>.*)/,
  process: (match, analyser) => {
    return {
      date: new Date(
        match.groups.year,
        match.groups.month - 1,
        match.groups.day,
        match.groups.hours,
        match.groups.minutes
      ),
      process: match.groups.process,
      message: match.groups.message
    };
  }
};
