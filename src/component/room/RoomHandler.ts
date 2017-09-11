// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";
import { FriendlyCityRoom } from "./FriendlyCityRoom";
import { FriendlyColonyRoom } from "./FriendlyColonyRoom";
import { EnemyCityRoom } from "./EnemyCityRoom";
import { EnemyColonyRoom } from "./EnemyColonyRoom";
import { NeutralRoom } from "./NeutralRoom";

export class RoomHandler {
  public room: Room;

  constructor (room: Room) {
    this.room = room;
  }

  public run() {
    this.processRoom(this.room);
  }

  private determineRoomType(room: Room) {
    let spawns = room.find(FIND_MY_SPAWNS);
    if (spawns.length > 0) {
      return ROOM_FRIENDLY_CITY;
    }

    let controller = room.controller;
    if (controller && controller.my) {
      return ROOM_FRIENDLY_COLONY;
    }

    spawns = this.room.find(FIND_HOSTILE_SPAWNS);
    if (spawns.length > 0) {
      return ROOM_ENEMY_CITY;
    }

    if (controller && controller.owner.username !== "") {
      return ROOM_ENEMY_COLONY;
    }

    return ROOM_NEUTRAL;
  }

  private processRoom(room: Room) {
    let roomType = this.determineRoomType(room);

    if (roomType === ROOM_FRIENDLY_CITY) {
      this.processFriendlyCityRoom(room);
    }

    if (roomType === ROOM_FRIENDLY_COLONY) {
      this.processFriendlyColonyRoom(room);
    }

    if (roomType === ROOM_ENEMY_CITY) {
      this.processEnemyCityRoom(room);
    }

    if (roomType === ROOM_ENEMY_COLONY) {
      this.processEnemyColonyRoom(room);
    }

    if (roomType === ROOM_NEUTRAL) {
      this.processNeutralRoom(room);
    }
  }

  private processFriendlyCityRoom(room: Room) {
    let friendlyCityRoom = new FriendlyCityRoom(room);
    friendlyCityRoom.run();
  }

  private processFriendlyColonyRoom(room: Room) {
    let friendlyColonyRoom = new FriendlyColonyRoom(room);
    friendlyColonyRoom.run();
  }

  private processEnemyCityRoom(room: Room) {
    let enemyCityRoom = new EnemyCityRoom(room);
    enemyCityRoom.run();
  }

  private processEnemyColonyRoom(room: Room) {
    let enemyColonyRoom = new EnemyColonyRoom(room);
    enemyColonyRoom.run();
  }

  private processNeutralRoom(room: Room) {
    let neutralRoom = new NeutralRoom(room);
    neutralRoom.run();
  }
}
