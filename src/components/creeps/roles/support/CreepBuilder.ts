// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepBuilder extends CreepSupport {
  // TODO: Change into a shared enum.
  public readonly STATE_BUILDING = "BUILDING";
  public readonly STATE_REFUELING = "REFUELING";
  // public readonly STATE_RENEWING = "RENEWING";

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    let state = this.creep.memory.state = this.determineCurrentState(this.creep);

    // if (state === STATE_RENEWING) {
    //   // let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
    //   // creepActions.moveToRenew(creep, spawn);
    //   // return;
    //   state = creep.memory.state = STATE_REFUELING;
    // }

    if (state === this.STATE_REFUELING) {
      this.getEnergy(this.creep);
      return;
    }

    if (state === this.STATE_BUILDING) {
      let constructionSites = this.roomHandler.loadConstructionSites(this.creep.room);
      if (constructionSites.length > 0) {
        let constructionSite = this.creep.pos.findClosestByPath<ConstructionSite>(constructionSites);
        this.build(this.creep, constructionSite);
        return;
      }

      let damagedStructures = this.roomHandler.loadDamagedStructures(this.creep.room);
      if (damagedStructures.length > 0) {
        let damagedStructure = this.creep.pos.findClosestByPath<Structure>(damagedStructures);
        this.moveToRepair(this.creep, damagedStructure);
        return;
      }
    }

    // TODO: Move randomly. This should keep the creep as an obstacle to a minimum.
    // TODO: Otherwise, move creep to an idle location.
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

    if (this.roomHandler.constructionSitesExist(creep.room)) {
      return this.STATE_BUILDING;
    }

    // TODO: Add STATE_IDLE
    // return STATE_IDLE;
    return this.STATE_BUILDING;
  }

  public build(creep: Creep, constructionSite: ConstructionSite): void {
    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
      this.moveTo(creep, constructionSite.pos);
    }
  }

  public getEnergy(creep: Creep): void {
    let containers = this.roomHandler.loadContainersWithEnergy(creep.room);
    if (containers.length > 0) {
      let container = creep.pos.findClosestByPath<Container>(containers);
      this.moveToWithdraw(creep, container);
      return;
    }

    let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
    this.moveToHarvest(creep, energySource);
  }

  public moveToRepair(creep: Creep, structure: Structure): void {
    if (this.tryRepair(creep, structure) === ERR_NOT_IN_RANGE) {
      creep.moveTo(structure, {visualizePathStyle: {stroke: "#ff0000"}});
    }
  }

  public tryRepair(creep: Creep, structure: Structure): number {
    return creep.repair(structure);
  }

  /*
  protected moveToUnderConstructionRoom(creep: Creep, roomManager: RoomManager): ??? {

  }
  */
}
