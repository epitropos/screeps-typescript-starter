// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";
import { FriendlyCityRoom } from "./FriendlyCityRoom";

export class RoomHandler {
  public static InitializeMemory() {
    // TODO: Code goes here.
  }

  public room: Room;

  constructor (room: Room) {
    this.room = room;
  }

  public run() {
    // TODO: Determine type of room
    let friendlyCityRoom = new FriendlyCityRoom(this.room);
    friendlyCityRoom.run();
  }
}
