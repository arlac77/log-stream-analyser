import { createReadStream } from "fs";
import { LogStreamAggregator } from "./log-stream-aggregator";
import { LogStreamAnalyser } from "./log-stream-analyser";
import { version } from "../package.json";

const lsa = new LogStreamAggregator();
const analyser = new LogStreamAnalyser();

const [,, ...files] = process.argv;

files.forEach(file => lsa.addSource( createReadStream(file), analyser));

async function go() {
  for await (const e of lsa) {
    console.log(JSON.stringify(e));
  }
}

go();
