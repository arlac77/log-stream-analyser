import { createReadStream } from "fs";
import { LogStreamAggregator } from "./log-stream-aggregator";
import { LogStreamAnalyser } from "./log-stream-analyser";

async function ab() {
  const lsa = new LogStreamAggregator();

  lsa.addSource(createReadStream(process.argv[2]), new LogStreamAnalyser());

  for await (const e of lsa) {
    console.log(`event:${JSON.stringify(e)}`);
  }
}

ab();
