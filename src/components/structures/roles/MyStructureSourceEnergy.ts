// import * as Config from "../../../config/config";
// import {log} from "../../../lib/logger/log";
import {MyStructureSource} from "./MyStructureSource";
import {RoomHandler} from "../../rooms/RoomHandler";

export class MyStructureSourceEnergy extends MyStructureSource {
  private source: Source;

  constructor(source: Source, roomHandler: RoomHandler) {
    super(roomHandler);

    this.source = source;
  }

  public canMine() {
    if (this.source.energy > 0) {
      return true;
    }

    return false;
  }
}
