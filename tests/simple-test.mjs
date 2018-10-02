import test from "ava";
import { join } from "path";
import { createReadStream } from "fs";
import { LogStreamAggregator } from "../src/log-stream-aggregator";
import { LogStreamAnalyser } from "../src/log-stream-analyser";
import {
  SystemLogMatcher,
  PacmanLogMatcher,
  WeblogicOutMatcher,
  WeblogicLogMatcher
} from "../src/line-matcher";

test("SystemLogMatcher install.log", async t => {
  const lsa = new LogStreamAggregator();

  const analyser = new LogStreamAnalyser([SystemLogMatcher]);

  lsa.addSource(
    createReadStream(
      join(__dirname, "..", "tests", "fixtures", "install.log.txt")
    ),
    analyser
  );

  const events = [];

  for await (const e of lsa) {
    events.push(e);
  }

  t.deepEqual(events[0], {
    date: new Date("Sep 24 22:04:14 2018"),
    host: "pro.maydomain.com",
    process: "softwareupdate_firstrun_tasks",
    pid: 63,
    message: "Host swscan.apple.com isReachable = YES"
  });

  t.deepEqual(events[1], {
    date: new Date("Sep 24 22:04:20 2018"),
    host: "pro",
    process: "loginwindow",
    pid: 83,
    scope: "IASGetCurrentInstallPhaseList",
    message: "no install phase array set"
  });
});

test("PacmanLogMatcher pacman.log", async t => {
  const lsa = new LogStreamAggregator();

  const analyser = new LogStreamAnalyser([PacmanLogMatcher]);

  lsa.addSource(
    createReadStream(
      join(__dirname, "..", "tests", "fixtures", "pacman.log.txt")
    ),
    analyser
  );

  const events = [];

  for await (const e of lsa) {
    events.push(e);
  }

  t.deepEqual(events[0], {
    date: new Date("Sep 08 19:12 2017"),
    process: "PACMAN",
    message: "Running 'pacman -Syu'"
  });
});

test("WeblogicOutMatcher weblogic.out", async t => {
  const lsa = new LogStreamAggregator();
  const analyser = new LogStreamAnalyser([WeblogicOutMatcher]);

  lsa.addSource(
    createReadStream(
      join(__dirname, "..", "tests", "fixtures", "weblogic.out.txt")
    ),
    analyser
  );

  const events = [];

  for await (const e of lsa) {
    events.push(e);
  }

  t.deepEqual(events[0], {
    date: new Date("Sep 15 10:32:21 2018"),
    severity: "Info",
    scope: "Security",
    "bea-id": "BEA-090905",
    message:
      "Disabling the CryptoJ JCE Provider self-integrity check for better startup performance. To enable this check, specify"
  });
});

test("WeblogicLogMatcher weblogic.log", async t => {
  const lsa = new LogStreamAggregator();
  const analyser = new LogStreamAnalyser([WeblogicLogMatcher]);

  lsa.addSource(
    createReadStream(
      join(__dirname, "..", "tests", "fixtures", "weblogic.log.txt")
    ),
    analyser
  );

  const events = [];

  for await (const e of lsa) {
    events.push(e);
  }

  t.deepEqual(events[0], {
    date: new Date("Oct 2 12:00:25 2018"),
    severity: "Info",
    scope: "Diagnostics"
  });
});
