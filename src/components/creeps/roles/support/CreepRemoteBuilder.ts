import {RoomHandler} from "../../../rooms/RoomHandler";
import {CreepBuilder} from "./CreepBuilder";

export class CreepRemoteBuilder extends CreepBuilder {
  public remoteRoomHandler: RoomHandler;

  constructor(creep: Creep, roomHandler: RoomHandler, remoteRoomHandler: RoomHandler) {
    super(creep, roomHandler);

    this.remoteRoomHandler = remoteRoomHandler;
  }

  public run() {
    super.run();
  }
}
