// class CreeperBuilder extends CreeperSupport {
//   protected determineCurrentState(creep: Creep): CreeperState {
//     let state = creep.memory.state;

//     if (state === CreeperState.Renewing) {
//       if (!this.renewComplete(creep)) {
//         return CreeperState.Renewing;
//       }
//     }

//     if (this.needsRenew(creep)) {
//       return CreeperState.Renewing;
//     }

//     if (state === CreeperState.Refueling) {
//       if (!this.refuelingComplete(creep)) {
//         return CreeperState.Refueling;
//       }
//     }

//     if (this.needsToRefuel(creep)) {
//       return CreeperState.Refueling;
//     }

//     if (this.constructionSitesExist(creep.room)) {
//       return CreeperState.Building;
//     }

//     // TODO: Add CreeperState.Idle
//     // return CreeperState.Idle;
//     return CreeperState.Building;
//   }

//   protected build(creep: Creep, constructionSite: ConstructionSite): void {
//     if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
//       this.moveTo(creep, constructionSite.pos);
//     }
//   }

//   protected getEnergy(creep: Creep): void {
//     let containers = roomManager.loadContainers(creep.room);
//     if (containers.length > 0) {
//       let container = creep.pos.findClosestByPath(containers);
//       this.moveToWithdraw(creep, container);
//       return;
//     }

//     let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
//     this.moveToHarvest(creep, energySource);
//   }

//   protected moveToRepair(creep: Creep, structure: Structure): void {
//     if (this.tryRepair(creep, structure) === ERR_NOT_IN_RANGE) {
//       creep.moveTo(structure, {visualizePathStyle: {stroke: "#ffffff"}});
//     }
//   }

//   protected tryRepair(creep: Creep, structure: Structure): number {
//     return creep.repair(structure);
//   }

//   /*
//   protected moveToUnderConstructionRoom(creep: Creep, roomManager: RoomManager): ??? {

//   }
//   */
// }
