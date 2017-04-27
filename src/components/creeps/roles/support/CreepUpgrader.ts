// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepUpgrader extends CreepSupport {
  protected readonly STATE_UPGRADING = "UPGRADING";
  protected readonly STATE_REFUELING = "REFUELING";

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    let state = this.creep.memory.state = this.determineCurrentState(this.creep);

    // if (state === this.STATE_RENEWING) {
    //   // let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
    //   // this.moveToRenew(creep, spawn);
    //   // return;
    //   state = creep.memory.state = this.STATE_REFUELING;
    // }

    if (state === this.STATE_REFUELING) {
      this.getEnergy(this.creep);
      return;
    }

    if (state === this.STATE_UPGRADING) {
      let controller = <Controller> this.creep.room.controller;
      this.moveToUpgrade(this.creep, controller);
      return;
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

    if (this.roomHandler.controllerNeedsUpgrading(creep.room)) {
      return this.STATE_UPGRADING;
    }

    // TODO: Add STATE_IDLE
    // return STATE_IDLE;
    return this.STATE_UPGRADING;
  }

  public getEnergy(creep: Creep): void {
    let containers = this.roomHandler.loadContainersWithEnergy(creep.room);
    if (containers.length > 0) {
      let container = creep.pos.findClosestByPath(containers);
      this.moveToWithdraw(creep, container);
      return;
    }

    let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
    this.moveToHarvest(creep, energySource);
  }

  public tryUpgrade(creep: Creep, target: Controller): number {
    return creep.upgradeController(target);
  }

  public moveToUpgrade(creep: Creep, target: Controller): void {
    if (this.tryUpgrade(creep, target) === ERR_NOT_IN_RANGE) {
      this.moveTo(creep, target.pos);
    }
  }
}
