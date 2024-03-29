import test from "ava";
import { join, dirname } from "node:path";
import { createReadStream } from "node:fs";
import { fileURLToPath } from "url";
import { LogStreamAggregator } from "../src/log-stream-aggregator.mjs";
import { LogStreamAnalyser } from "../src/log-stream-analyser.mjs";
import {
  SystemLogMatcher,
  PacmanLogMatcher,
  WeblogicOutMatcher,
  WeblogicLogMatcher,
} from "../src/line-matcher.mjs";

const year = (new Date()).getFullYear();

async function makeAnalyser(matcher, fixture) {
  const lsa = new LogStreamAggregator();
  const analyser = new LogStreamAnalyser([matcher]);
  const here = dirname(fileURLToPath(import.meta.url));

  lsa.addSource(
    createReadStream(join(here, "..", "tests", "fixtures", fixture)),
    analyser
  );

  const events = [];

  for await (const e of lsa) {
    events.push(e);
  }

  return events;
}

test("SystemLogMatcher install.log", async t => {
  const events = await makeAnalyser(SystemLogMatcher, "install.log.txt");

  t.deepEqual(events[0], {
    date: new Date(`Sep 24 22:04:14 ${year}`),
    host: "pro.maydomain.com",
    process: "softwareupdate_firstrun_tasks",
    pid: 63,
    message: "Host swscan.apple.com isReachable = YES"
  });

  t.deepEqual(events[1], {
    date: new Date(`Sep 24 22:04:20 ${year}`),
    host: "pro",
    process: "loginwindow",
    pid: 83,
    scope: "IASGetCurrentInstallPhaseList",
    message: "no install phase array set"
  });
});

test("PacmanLogMatcher pacman.log", async t => {
  const events = await makeAnalyser(PacmanLogMatcher, "pacman.log.txt");

  t.deepEqual(events[0], {
    date: new Date("Sep 08 19:12 2017"),
    process: "PACMAN",
    message: "Running 'pacman -Syu'"
  });
});

test("WeblogicOutMatcher weblogic.out", async t => {
  const events = await makeAnalyser(WeblogicOutMatcher, "weblogic.out.txt");

  t.deepEqual(events[0], {
    date: new Date("Sep 15 10:32:21 2018"),
    severity: "info",
    scope: "Security",
    "bea-id": "BEA-090905",
    message:
      "Disabling the CryptoJ JCE Provider self-integrity check for better startup performance. To enable this check, specify"
  });
});

test("WeblogicLogMatcher weblogic-2.out", async t => {
  const events = await makeAnalyser(WeblogicOutMatcher, "weblogic-2.out.txt");

  t.deepEqual(events[0], {
    date: new Date("Nov 22 2013 2:05:11"),
    "bea-id": "BEA-090905",
    severity: "info",
    scope: "Security",
    message:
      "Disabling CryptoJ JCE Provider self-integrity check for better startup performance. To enable this check, specify -Dweblogic.security.allowCryptoJDefaultJCEVerification=true"
  });

  t.deepEqual(events[4], {
    date: new Date("Nov 22 2013 2:05:17"),
    "bea-id": "BEA-090065",
    severity: "info",
    scope: "Security",
    message: "Getting boot identity from user."
  });

  /*
  t.deepEqual(events[10], {
    date: new Date("Nov 22 2013 2:05:58"),
    "bea-id": 'BEA-000386',
    severity: "critical",
    scope: "WebLogicServer",
    message: 'Server subsystem failed. Reason: weblogic.security.SecurityInitializationException: Authentication for user denied.'
  });
*/
});

test("WeblogicLogMatcher weblogic.log", async t => {
  const events = await makeAnalyser(WeblogicLogMatcher, "weblogic.log.txt");

  t.deepEqual(events[0], {
    date: new Date("Oct 2 12:00:25 2018"),
    severity: "info",
    scope: "Diagnostics"
  });
});

test.skip("DovecotLogMatcher", async t => {
  const events = await makeAnalyser(WeblogicLogMatcher, "dovecot.log.txt");

  t.deepEqual(events[0], {
    date: new Date("Oct 2 21:35:41 2018"),
    user: "hubert",
    uid: 5001,
    server: "server1",
    process: "dovecot",
    pid: 299
  });
});
