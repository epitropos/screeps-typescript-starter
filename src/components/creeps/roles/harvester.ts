// import * as creepActions from "../creepActions";
// import * as creepEnergyActions from "../creepEnergyActions";
// import * as roomActions from "../../rooms/roomActions";

// // TODO: Shorten to save memory.
// export const STATE_DELIVERING = "DELIVERING";
// export const STATE_REFUELING = "REFUELING";
// // export const STATE_RENEWING = "RENEWING";

// /**
//  * Runs all creep actions.
//  *
//  * @export
//  * @param {Creep} creep
//  */
// export function run(creep: Creep): void {
//   let state = creep.memory.state = _determineCurrentState(creep);

//   let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];

//   // if (state === STATE_RENEWING) {
//   //   // creepActions.moveToRenew(creep, spawn);
//   //   state = creep.memory.state = STATE_REFUELING;
//   // }

//   if (state === STATE_REFUELING) {
//     let droppedEnergy = creep.pos.findClosestByPath<Resource>(FIND_DROPPED_ENERGY);
//     if (droppedEnergy) {
//       creepActions.moveToPickup(creep, droppedEnergy);
//       return;
//     }

//     let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
//     if (energySource) {
//       creepEnergyActions.moveToHarvest(creep, energySource);
//       return;
//     }
//   }

//   if (state === STATE_DELIVERING) {
//     if (spawn.energy < spawn.energyCapacity) {
//       creepEnergyActions.moveToDropEnergy(creep, spawn);
//       return;
//     }

//     let extensions = roomActions.loadExtensions(creep.room);
//     if (extensions.length > 0) {
//       let extension = creep.pos.findClosestByPath<Extension>(extensions);
//       creepEnergyActions.moveToDropEnergy(creep, extension);
//       return;
//     }

//     let towers = roomActions.loadTowers(creep.room);
//     if (towers.length > 0) {
//       let tower = creep.pos.findClosestByPath<Tower>(towers);
//       creepEnergyActions.moveToDropEnergy(creep, tower);
//       return;
//     }

//     let containers = roomActions.loadContainersWithSpace(creep.room);
//     if (containers.length > 0) {
//       let container = creep.pos.findClosestByPath<Container>(containers);
//       creepEnergyActions.moveToDropEnergy(creep, container);
//       return;
//     }

//     if (creep.room.storage) {
//       creepEnergyActions.moveToDropEnergy(creep, creep.room.storage);
//       return;
//     }
//   }
// }

// function _determineCurrentState(creep: Creep): string {
//   let state = creep.memory.state;

//   // if (state === STATE_RENEWING) {
//   //   if (!creepActions.renewComplete(creep)) {
//   //     return STATE_RENEWING;
//   //   }
//   // }

//   // if (creepActions.needsRenew(creep)) {
//   //   return STATE_RENEWING;
//   // }

//   if (state === STATE_REFUELING) {
//     if (!creepActions.refuelingComplete(creep)) {
//       return STATE_REFUELING;
//     }
//   }

//   if (creepActions.needsToRefuel(creep)) {
//     return STATE_REFUELING;
//   }

//   if (creepActions.refuelingComplete) {
//     return STATE_DELIVERING;
//   }

//   // TODO: Add STATE_IDLE
//   // return STATE_IDLE;
//   return STATE_DELIVERING;
// }
