// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class SourceHandler {
  public static InitializeMemory() {
    // TODO: Code goes here.
  }

  public source: Source;

  constructor (source: Source) {
    this.source = source;
  }

  public run() {
    log.info("Process source: " + this.source.id );

    // TODO: Code goes here.
  }
}
