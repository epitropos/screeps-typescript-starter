// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";
import { EnergySource } from "./EnergySource";

export class SourceHandler {
  public source: Source;

  constructor (source: Source) {
    this.source = source;
  }

  public run() {
    let source = new EnergySource(this.source);
    source.run();
  }
}
