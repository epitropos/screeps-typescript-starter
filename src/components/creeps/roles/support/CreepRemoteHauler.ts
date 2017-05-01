import {RoomHandler} from "../../../rooms/RoomHandler";
import {CreepHauler} from "./CreepHauler";

export class CreepRemoteHauler extends CreepHauler {
  public remoteRoomHandler: RoomHandler;

  constructor(creep: Creep, roomHandler: RoomHandler, remoteRoomHandler: RoomHandler) {
    super(creep, roomHandler);

    this.remoteRoomHandler = remoteRoomHandler;
  }

  public run() {
    super.run();
  }
}
