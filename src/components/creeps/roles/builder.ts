import * as creepActions from "../creepActions";
import * as creepEnergyActions from "../creepEnergyActions";
import * as roomActions from "../../rooms/roomActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function run(creep: Creep): void {
  if (creepActions.isRenewing(creep)) {
    let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
    creepActions.moveToRenew(creep, spawn);
    return;
  }

  if (_.sum(creep.carry) < creep.carryCapacity) {
    _getEnergy(creep);
    return;
  }

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
