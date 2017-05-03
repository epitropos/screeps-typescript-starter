// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepStocker extends CreepSupport {
  public static getBodyParts(energyAvailable: number) {
    let bodyParts: string[] = [];
    let bodySegmentSize = 250;

    let bodyPartsSize = 0;

    while (bodyPartsSize + bodySegmentSize < energyAvailable) {
      bodyParts.push(CARRY);
      bodyParts.push(CARRY);
      bodyParts.push(MOVE);
      bodyPartsSize += bodySegmentSize;
    }

    // TODO: Move function into CreepSupport.
    return _.sortBy(bodyParts, function(bodyPart) {
      switch (bodyPart) {
        case CARRY: return 2;
        case MOVE: return 3;
        case WORK: return 1;
        default: return 99;
      }
    });
  }

  public readonly STATE_DELIVERING = "DELIVERING";
  public readonly STATE_REFUELING = "REFUELING";

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    let state = this.creep.memory.state || this.STATE_REFUELING;

    if (state === this.STATE_REFUELING) {
      let storage = this.creep.room.storage;
      if (storage) {
        let availableEnergy = storage.store[RESOURCE_ENERGY] || 0;
        if (availableEnergy > 0) {
          this.moveToWithdrawFromStorage(this.creep, storage);
        }
      }
    } else if (state === this.STATE_DELIVERING) {
      let extensions = this.roomHandler.loadExtensions(this.creep.room);
      if (extensions.length > 0) {
        let extension = this.creep.pos.findClosestByPath<Extension>(extensions);
        this.moveToDropEnergy(this.creep, extension);
      } else {
        let spawn = this.creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
        if (spawn.energy < spawn.energyCapacity) {
          this.moveToDropEnergy(this.creep, spawn);
        } else {
          let towers = this.roomHandler.loadTowers(this.creep.room);
          if (towers.length > 0) {
            let tower = this.creep.pos.findClosestByPath<Tower>(towers);
            this.moveToDropEnergy(this.creep, tower);
          }
        }
      }
    }

    if (this.creep.carry[RESOURCE_ENERGY] || 0 > 0) {
      this.creep.memory.state = this.STATE_DELIVERING;
    } else {
      this.creep.memory.state = this.STATE_REFUELING;
    }
  }
}
