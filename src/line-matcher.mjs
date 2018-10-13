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

// Oct 02 21:35:41 server1 dovecot[299]: imap(hubert)<5001><LYaxwUN3ickKAAEB>: Server shutting down.
// in=%i out=%o deleted=%{deleted} expunged=%{expunged} trashed=%{trashed} hdr_count=%{fetch_hdr_count}
// hdr_bytes=%{fetch_hdr_bytes} body_count=%{fetch_body_count} body_bytes=%{fetch_body_bytes}

const dovecotAttributes = [
  "in",
  "out",
  "deleted",
  "expunged",
  "trashed",
  "hdr_count",
  "hdr_bytes",
  "body_count",
  "body_bytes"
];

export const DovecotLogMatcher = {
  regex: new RegExp(
    '(?<month>\w+)\s+(?<day>\d\d)\s+(?<hours>\d\d):(?<minutes>\d\d):(?<seconds>\d\d)\s+(?<host>\w+)\s+(?<process>\w+)\[(?<pid>\d+)\]:\s+(?<program>\w+)\((?<user>\w+)\)<(?<uid>\d+)><(?<xxx>\w+)>:\s+(?<message>[^\.]+)\.' +
    dovecotAttributes.map(a => `${a}=(?<${a}>\\d+)`).join("\\s+")
  ),
  process: (match, analyser) =>
    dovecotAttributes.reduce((acc, name) => {
      if (match.groups[name] !== undefined) {
        acc[name] = parseInt(match.groups.in, 10);
      }
      return acc;
    }, {})
};

export const WeblogicOutMatcher = {
  regex: /<(?<date>[^>]+)>\s+<(?<severity>\w+)>\s+<(?<scope>[^>]+)>\s+<(?<id>[^>]+)>\s+<(?<message>[^>]+)>/,
  process: (match, analyser) => {
    return {
      date: s2d(match.groups.date),
      severity: match.groups.severity.toLowerCase(),
      scope: match.groups.scope,
      "bea-id": match.groups.id,
      message: match.groups.message
    };
  }
};

export const WeblogicLogMatcher = {
  regex: /####<(?<date>[^>]+)>\s+<(?<severity>\w+)>\s+<(?<scope>[^>]+)>(?<fragments>\s+<([^>]+)>)+/,
  process: (match, analyser) => {
    return {
      date: s2d(match.groups.date),
      severity: match.groups.severity.toLowerCase(),
      scope: match.groups.scope
    };
  }
};

function s2d(str) {
  //Sep 15, 2018 10:32:21 PM CEST
  //Oct 2, 2018, 12:00:25,113 AM CEST
  const match = str.match(
    /(?<month>\w+)\s+(?<day>\d+),\s+(?<year>\d+),?\s+(?<hours>\d+):(?<minutes>\d+):(?<seconds>\d+)(,(?<msecs>\d+))?\s+(?<moon>\w+)\s+(?<tz>\w+)/
  );
  if (match) {
    return new Date(
      match.groups.year,
      m2n[match.groups.month],
      match.groups.day,
      match.groups.hours,
      match.groups.minutes,
      match.groups.seconds
      //,match.groups.msecs
    );
  }
}

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
