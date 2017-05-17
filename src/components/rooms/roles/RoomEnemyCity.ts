import {RoomEnemy} from "./RoomEnemy";

export class RoomEnemyCity extends RoomEnemy {
  public spawns: Spawn[];

  constructor(room: Room) {
    super(room);
    this.spawns = room.find<Spawn>(FIND_HOSTILE_SPAWNS);
  }

  public run() {
    super.run();
  }
}
