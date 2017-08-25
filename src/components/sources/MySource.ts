// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MySource {
  public source: Source;

  constructor (source: Source) {
    this.source = source;
  }

  public run() {
    log.info("Process source: " + this.source.room.name + ":" + this.source.id);
  }
}
