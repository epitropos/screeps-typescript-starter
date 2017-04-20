// import * as Config from "../../../config/config";
// import { log } from "../../../lib/logger/log";

import * as creepActions from "../creepActions";
import * as creepEnergyActions from "../creepEnergyActions";
import * as roomActions from "../../rooms/roomActions";

// TODO: Shorten to save memory.
export const STATE_BUILDING = "BUILDING";
export const STATE_REFUELING = "REFUELING";
export const STATE_RENEWING = "RENEWING";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function run(creep: Creep): void {
  let state = creep.memory.state = _determineCurrentState(creep);

  if (state === STATE_RENEWING) {
    let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
    creepActions.moveToRenew(creep, spawn);
    return;
  }

  if (state === STATE_REFUELING) {
    _getEnergy(creep);
    return;
  }

  if (state === STATE_BUILDING) {
    let constructionSites = roomActions.loadConstructionSites(creep.room);
    if (constructionSites.length > 0) {
      let constructionSite = creep.pos.findClosestByPath(constructionSites);
      _build(creep, constructionSite);
      return;
    }

    let damagedStructures = roomActions.loadDamagedStructures(creep.room);
    if (damagedStructures.length > 0) {
      let damagedStructure = creep.pos.findClosestByPath(damagedStructures);
      _moveToRepair(creep, damagedStructure);
      return;
    }
  }

  // TODO: Move randomly. This should keep the creep as an obstacle to a minimum.
  // TODO: Otherwise, move creep to an idle location.
}

function _determineCurrentState(creep: Creep): string {
  let state = creep.memory.state;

  if (state === STATE_RENEWING) {
    if (!creepActions.renewComplete(creep)) {
      return STATE_RENEWING;
    }
  }

  if (creepActions.needsRenew(creep)) {
    return STATE_RENEWING;
  }

  if (creepActions.needsToRefuel(creep)) {
    return STATE_REFUELING;
  }

  if (roomActions.constructionSitesExist(creep.room)) {
    return STATE_BUILDING;
  }

  // TODO: Add STATE_IDLE
  // return STATE_IDLE;
  return STATE_BUILDING;
}

function _build(creep: Creep, constructionSite: ConstructionSite): void {
  if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, constructionSite.pos);
  }
}

function _getEnergy(creep: Creep): void {
  let containers = roomActions.loadContainers(creep.room);
  if (containers.length > 0) {
    let container = creep.pos.findClosestByPath(containers);
    creepEnergyActions.moveToWithdraw(creep, container);
    return;
  }

  let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
  creepEnergyActions.moveToHarvest(creep, energySource);
}

function _moveToRepair(creep: Creep, structure: Structure): void {
  if (_tryRepair(creep, structure) === ERR_NOT_IN_RANGE) {
    creep.moveTo(structure, {visualizePathStyle: {stroke: "#ffffff"}});
  }
}

function _tryRepair(creep: Creep, structure: Structure): number {
  return creep.repair(structure);
}

/*
function moveToUnderConstructionRoom(creep: Creep, roomManager: RoomManager): ??? {

}
*/
