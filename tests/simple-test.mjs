import test from "ava";
import { join } from "path";
import { createReadStream } from "fs";
import { LogStreamAggregator } from "../src/log-stream-aggregator";
import { LogStreamAnalyser } from "../src/log-stream-analyser";

test("install.log", async t => {
  const lsa = new LogStreamAggregator();

  lsa.addSource(
    createReadStream(
      join(__dirname, "..", "tests", "fixtures", "install.log.txt")
    )
  );

  /*
  for await (const e of lsa) {
    t.is(e.hostname, 'pro');
  }
  */

  const analyser = new LogStreamAnalyser();

  const eventIter = await analyser[Symbol.asyncIterator]();

  const event = (await eventIter.next()).value;

  t.deepEqual(event, {
    date: "Sep 24 22:04:14",
    hostname: "pro",
    message:
      "softwareupdate_firstrun_tasks[63]: Host swscan.apple.com isReachable = YES"
  });
});
