import { createReadStream } from "node:fs";
import { LogStreamAggregator } from "./log-stream-aggregator.mjs";
import { LogStreamAnalyser } from "./log-stream-analyser.mjs";
import {
  SystemLogMatcher,
  PacmanLogMatcher,
  WeblogicOutMatcher,
  WeblogicLogMatcher,
  DovecotLogMatcher
} from "./line-matcher.mjs";

const lsa = new LogStreamAggregator();
const analyser = new LogStreamAnalyser([
  SystemLogMatcher,
  PacmanLogMatcher,
  WeblogicLogMatcher,
  WeblogicOutMatcher,
  DovecotLogMatcher
]);

const [, , ...files] = process.argv;

files.forEach(file => lsa.addSource(createReadStream(file), analyser));

async function go() {
  for await (const e of lsa) {
    console.log(JSON.stringify(e));
  }
}

go();
