// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepHarvester extends CreepSupport {
  // TODO: Change into a shared enum.
  public readonly STATE_DELIVERING = "DELIVERING";
  public readonly STATE_REFUELING = "REFUELING";
  // public readonly STATE_RENEWING = "RENEWING";

  // export const STATE_DELIVERING = "DELIVERING";
  // export const STATE_REFUELING = "REFUELING";
  // // export const STATE_RENEWING = "RENEWING";

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    let state = this.creep.memory.state = this.determineCurrentState(this.creep);

    let spawn = this.creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];

    // if (state === STATE_RENEWING) {
    //   // creepActions.moveToRenew(creep, spawn);
    //   state = creep.memory.state = STATE_REFUELING;
    // }

    if (state === this.STATE_REFUELING) {
      let droppedEnergy = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_ENERGY,
        {filter: (r: Resource) => r.resourceType === RESOURCE_ENERGY});
      if (droppedEnergy) {
        this.moveToPickup(this.creep, droppedEnergy);
        return;
      }

      let energySource = this.creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
      if (energySource) {
        this.moveToHarvest(this.creep, energySource);
        return;
      }
    }

    if (state === this.STATE_DELIVERING) {
      let extensions = this.roomHandler.loadExtensions(this.creep.room);
      if (extensions.length > 0) {
        let extension = this.creep.pos.findClosestByPath<Extension>(extensions);
        this.moveToDropEnergy(this.creep, extension);
        return;
      }

      if (spawn.energy < spawn.energyCapacity) {
        this.moveToDropEnergy(this.creep, spawn);
        return;
      }

      let towers = this.roomHandler.loadTowers(this.creep.room);
      if (towers.length > 0) {
        let tower = this.creep.pos.findClosestByPath<Tower>(towers);
        this.moveToDropEnergy(this.creep, tower);
        return;
      }

      let containers = this.roomHandler.loadContainersWithSpace(this.creep.room);
      if (containers.length > 0) {
        let container = this.creep.pos.findClosestByPath<Container>(containers);
        this.moveToDropEnergy(this.creep, container);
        return;
      }

      if (this.creep.room.storage) {
        this.moveToDropEnergy(this.creep, this.creep.room.storage);
        return;
      }
    }
  }

  public determineCurrentState(creep: Creep): string {
    let state = creep.memory.state;

    // if (state === STATE_RENEWING) {
    //   if (!creepActions.renewComplete(creep)) {
    //     return STATE_RENEWING;
    //   }
    // }

    // if (creepActions.needsRenew(creep)) {
    //   return STATE_RENEWING;
    // }

    if (state === this.STATE_REFUELING) {
      if (!this.refuelingComplete(creep)) {
        return this.STATE_REFUELING;
      }
    }

    if (this.needsToRefuel(creep)) {
      return this.STATE_REFUELING;
    }

    if (this.refuelingComplete) {
      return this.STATE_DELIVERING;
    }

    // TODO: Add STATE_IDLE
    // return STATE_IDLE;
    return this.STATE_DELIVERING;
  }
}
