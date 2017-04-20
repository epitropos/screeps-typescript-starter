import * as creepActions from "../creepActions";
import * as creepEnergyActions from "../creepEnergyActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function run(creep: Creep): void {
  let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
  let extension = creep.pos.findClosestByPath<StructureExtension>(FIND_STRUCTURES, {
    filter: (s: StructureExtension) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity,
  });
  let container = creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
    filter: (s: Container) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
  });

  if (creepActions.isRenewing(creep)) {
    creepActions.moveToRenew(creep, spawn);
  } else if (spawn.energy < spawn.energyCapacity) {
    creepEnergyActions.moveToDropEnergy(creep, spawn);
  } else if (extension) {
    creepEnergyActions.moveToDropEnergy(creep, extension);
  } else {
    creepEnergyActions.moveToWithdraw(creep, container);
  }
}

/*
function findConstructionSite(creep: Creep)
{

}

function findDamagedStructure(creep: Creep)
{

}
*/

/*
function moveToUnderConstructionRoom(creep: Creep, roomManager: RoomManager)
{

}
*/
