// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";
import { MySource } from "./MySource";

export class SourceHandler {
  public static InitializeMemory() {
    // TODO: Code goes here.
  }

  public source: Source;

  constructor (source: Source) {
    this.source = source;
  }

  public run() {
    let source = new MySource(this.source);
    source.run();
  }
}
