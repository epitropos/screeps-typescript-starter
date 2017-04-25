// import * as Config from "../../config/config";
// import {log} from "../../lib/logger/log";
import {RoomHandler} from "../rooms/RoomHandler";

export class StructureHandler {
  public readonly structure: Structure;
  public readonly roomHandler: RoomHandler;

  constructor (structure: Structure) {
    this.structure = structure;
    this.roomHandler = new RoomHandler(structure.room);
  }

  public run() {
    // TODO: Code goes here.
  }
}
