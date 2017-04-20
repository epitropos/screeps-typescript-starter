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
  let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
  let container = creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
    filter: (s: Container) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
  });

  if (creepActions.isRenewing(creep)) {
    creepActions.moveToRenew(creep, spawn);
  } else if (_.sum(creep.carry) === creep.carryCapacity) {
    creepEnergyActions.moveToDropEnergy(creep, container);
  } else {
    creepEnergyActions.moveToHarvest(creep, energySource);
  }
}
