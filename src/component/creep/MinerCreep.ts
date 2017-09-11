// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MinerCreep {
  public static MinimumEnergyRequired = 150;

  public static getBodyParts(energyAvailable: number) {
    if (energyAvailable < MinerCreep.MinimumEnergyRequired) {
      return undefined;
    }

    let bodyParts: string[] = [WORK, MOVE];
    let bodySegmentSize = 100;

    let bodyPartsSize = 50 + 100;
    let bodyPartsSizeMax = 50 + 100 + 100 + 100 + 100 + 100;

    while (bodyPartsSize + bodySegmentSize <= energyAvailable && bodyPartsSize < bodyPartsSizeMax) {
      bodyParts.push(WORK);
      bodyPartsSize += bodySegmentSize;
    }

    // TODO: Move function into CreepSupport.
    return _.sortBy(bodyParts, function(bodyPart) {
      switch (bodyPart) {
        case CARRY: return 3;
        case MOVE: return 4;
        case WORK: return 2;
        case TOUGH: return 1;
        default: return 99;
      }
    });
  }

  public creep: Creep;
  public position: RoomPosition;
  public source: Source;
  public sourceId: string;

  constructor (creep: Creep) {
    this.creep = creep;
  }

  public run() {
    log.info("Process miner: " + this.creep.room.name + " - " + this.creep.name);

    this.initializeMemory();
    this.loadFromMemory();

    // TODO: Check TTL and issue clone message.

    if (this.creep.pos.inRangeTo(this.source.pos, 1)) {
      this.creep.harvest(this.source);
      return;
    }

    if (!this.creep.pos.inRangeTo(this.position, 0)) {
      this.creep.moveTo(this.position); // TODO: Use a better/cheaper pathing algorithm.
      return;
    }

    this.saveToMemory();
  }

  private initializeMemory() {
    // TODO: Code goes here.
  }

  private loadFromMemory() {
    // Primary data.
    this.sourceId = this.creep.memory.sourceId;
    let positionX = this.creep.memory.positionX;
    let positionY = this.creep.memory.positionY;
    let roomName = this.creep.memory.roomName;

    // Derived data.
    this.source = <Source> Game.getObjectById(this.sourceId);
    this.position = new RoomPosition(positionX, positionY, roomName);
  }

  private saveToMemory() {
    // TODO: Code goes here.
  }
}
