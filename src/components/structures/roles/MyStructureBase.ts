// import * as Config from "../../../config/config";
// import {log} from "../../../lib/logger/log";
import {RoomHandler} from "../../rooms/RoomHandler";

export class MyStructureBase {
  public structure: Structure;
  public roomHandler: RoomHandler;

  constructor(structure: Structure, roomHandler: RoomHandler) {
    this.structure = structure;
    this.roomHandler = roomHandler;
  }

  public isDamaged(structure: Structure): boolean {
    return structure.hits < structure.hitsMax;
  }
}
