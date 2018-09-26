import test from "ava";
import { join } from "path";
import { createReadStream } from "fs";
import { LogStreamAggregator } from "../src/log-stream-aggregator";
import { LogStreamAnalyser } from "../src/log-stream-analyser";

test("install.log", async t => {
  const lsa = new LogStreamAggregator();

  const analyser = new LogStreamAnalyser();

  lsa.addSource(
    createReadStream(
      join(__dirname, "..", "tests", "fixtures", "install.log.txt")
    ),  analyser);


  const events = [];

  for await (const e of lsa) {
    events.push(e);
  }

  t.deepEqual(events[0], {
    date: new Date("Sep 24 22:04:14 2018"),
    host: "pro",
    message:
      "softwareupdate_firstrun_tasks[63]: Host swscan.apple.com isReachable = YES"
  });
});
