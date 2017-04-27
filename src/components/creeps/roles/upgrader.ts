// import * as creepActions from "../creepActions";
// import * as creepEnergyActions from "../creepEnergyActions";
// import * as roomActions from "../../rooms/roomActions";

// // TODO: Shorten to save memory.
// export const STATE_UPGRADING = "UPGRADING";
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

//   // if (state === STATE_RENEWING) {
//   //   // let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
//   //   // creepActions.moveToRenew(creep, spawn);
//   //   // return;
//   //   state = creep.memory.state = STATE_REFUELING;
//   // }

//   if (state === STATE_REFUELING) {
//     _getEnergy(creep);
//     return;
//   }

//   if (state === STATE_UPGRADING) {
//     let controller = <Controller> creep.room.controller;
//     _moveToUpgrade(creep, controller);
//     return;
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

//   if (roomActions.controllerNeedsUpgrading(creep.room)) {
//     return STATE_UPGRADING;
//   }

//   // TODO: Add STATE_IDLE
//   // return STATE_IDLE;
//   return STATE_UPGRADING;
// }

// function _getEnergy(creep: Creep): void {
//   let containers = roomActions.loadContainersWithEnergy(creep.room);
//   if (containers.length > 0) {
//     let container = creep.pos.findClosestByPath(containers);
//     creepEnergyActions.moveToWithdraw(creep, container);
//     return;
//   }

//   let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
//   creepEnergyActions.moveToHarvest(creep, energySource);
// }

// function _tryUpgrade(creep: Creep, target: Controller): number {
//   return creep.upgradeController(target);
// }

// function _moveToUpgrade(creep: Creep, target: Controller): void {
//   if (_tryUpgrade(creep, target) === ERR_NOT_IN_RANGE) {
//     creepActions.moveTo(creep, target.pos);
//   }
// }
