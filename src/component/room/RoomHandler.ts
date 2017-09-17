import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
import { FriendlyCityRoom } from "./FriendlyCityRoom";
import { FriendlyColonyRoom } from "./FriendlyColonyRoom";
import { EnemyCityRoom } from "./EnemyCityRoom";
import { EnemyColonyRoom } from "./EnemyColonyRoom";
import { NeutralRoom } from "./NeutralRoom";

export class RoomHandler {
  public room: Room;

  private debug: boolean = false;

  constructor (room: Room) {
    this.room = room;
  }

  public run() {
    if (this.debug) {
      log.info(this.room.name + " - RoomHandler.run");
    }

    this.processRoom(this.room);
  }

  private determineRoomType(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - RoomHandler.determineRoomType");
    }

    let spawns = room.find(FIND_MY_SPAWNS);
    if (spawns.length > 0) {
      return Config.ROOM_FRIENDLY_CITY;
    }

    let controller = room.controller;
    if (controller && controller.my) {
      return Config.ROOM_FRIENDLY_COLONY;
    }

    spawns = this.room.find(FIND_HOSTILE_SPAWNS);
    if (spawns.length > 0) {
      return Config.ROOM_ENEMY_CITY;
    }

    if (controller && controller.owner.username !== "") {
      return Config.ROOM_ENEMY_COLONY;
    }

    return Config.ROOM_NEUTRAL;
  }

  private processRoom(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - RoomHandler.processRoom");
    }

    let roomType = this.determineRoomType(room);

    if (roomType === Config.ROOM_FRIENDLY_CITY) {
      this.processFriendlyCityRoom(room);
    }

    if (roomType === Config.ROOM_FRIENDLY_COLONY) {
      this.processFriendlyColonyRoom(room);
    }

    if (roomType === Config.ROOM_ENEMY_CITY) {
      this.processEnemyCityRoom(room);
    }

    if (roomType === Config.ROOM_ENEMY_COLONY) {
      this.processEnemyColonyRoom(room);
    }

    if (roomType === Config.ROOM_NEUTRAL) {
      this.processNeutralRoom(room);
    }
  }

  private processFriendlyCityRoom(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - RoomHandler.processFriendlyCityRoom");
    }

    let friendlyCityRoom = new FriendlyCityRoom(room);
    friendlyCityRoom.run();
  }

  private processFriendlyColonyRoom(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - RoomHandler.processFriendlyColonyRoom");
    }

    let friendlyColonyRoom = new FriendlyColonyRoom(room);
    friendlyColonyRoom.run();
  }

  private processEnemyCityRoom(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - RoomHandler.processEnemyCityRoom");
    }

    let enemyCityRoom = new EnemyCityRoom(room);
    enemyCityRoom.run();
  }

  private processEnemyColonyRoom(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - RoomHandler.processEnemyColonyRoom");
    }

    let enemyColonyRoom = new EnemyColonyRoom(room);
    enemyColonyRoom.run();
  }

  private processNeutralRoom(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - RoomHandler.processNeutralRoom");
    }

    let neutralRoom = new NeutralRoom(room);
    neutralRoom.run();
  }
}
