// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSoldier} from "./CreepSoldier";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepScout extends CreepSoldier {
  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();
  }
}
