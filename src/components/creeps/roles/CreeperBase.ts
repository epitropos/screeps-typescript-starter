// import * as Config from "../../../config/config";

// class CreeperBase {
//   public creep: Creep;
//   public roomManager: RoomManager;

//   constructor(creep: Creep, roomManager: RoomManager) {
//     this.creep = creep;
//     this.roomManager = roomManager;

//     // let oldState = creep.memory.state;
//     // let newState = this.determineNewState(oldState);
//     // if (oldState !== newState) {
//     //   creep.memory.state = newState;
//     // }
//   }

//   /*
//   protected requestReplacement(creep: Creep) {
//     Memory.requests.replacement["TodoNewRequestId"] = creep.id;
//   }
//   */

//   /*#######################*/
//   /*# Methods to refactor #*/
//   /*#######################*/

//   /**
//    * Shorthand method for `Creep.moveTo()`.
//    *
//    * @export
//    * @param {Creep} creep
//    * @param {(Structure | RoomPosition)} target
//    * @returns {number}
//    */
//   public moveTo(creep: Creep, target: Structure | RoomPosition): number {
//     let result: number = 0;

//     // Execute moves by cached paths at first
//     result = creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});

//     return result;
//   }

// TODO: Add logic to move.
// TODO: If time to live will not allow travel to destination then travel to spawn and recycle.
// TODO: If time to live will not allow travel to spawn then travel to nearest structure.

//   // TODO: Change this to needsMoreCargo.
//   public needsToRefuel(creep: Creep): boolean {
//     return (_.sum(creep.carry) === 0);
//   }

//   public refuelingComplete(creep: Creep): boolean {
//     return (_.sum(creep.carry) === creep.carryCapacity);
//   }

//   /**
//    * Returns true if the `ticksToLive` of a creep has dropped below the renew
//    * limit set in config.
//    *
//    * @export
//    * @param {Creep} creep
//    * @returns {boolean}
//    */
//   public needsRenew(creep: Creep): boolean {
//     return (creep.ticksToLive < Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL);
//   }

//   /**
//    * Returns true if the `ticksToLive` of a creep is above the refill mark set in config.
//    *
//    * @export
//    * @param {Creep} creep
//    * @returns {boolean}
//    */
//   public renewComplete(creep: Creep): boolean {
//     return (creep.ticksToLive >= Config.DEFAULT_REFILL_LIFE_TO);
//   }

//   /**
//    * Shorthand method for `renewCreep()`.
//    *
//    * @export
//    * @param {Creep} creep
//    * @param {Spawn} spawn
//    * @returns {number}
//    */
//   public tryRenew(creep: Creep, spawn: Spawn): number {
//     return spawn.renewCreep(creep);
//   }

//   /**
//    * Moves a creep to a designated renew spot (in this case the spawn).
//    *
//    * @export
//    * @param {Creep} creep
//    * @param {Spawn} spawn
//    */
//   public moveToRenew(creep: Creep, spawn: Spawn): void {
//     if (this.tryRenew(creep, spawn) === ERR_NOT_IN_RANGE) {
//       creep.moveTo(spawn, {visualizePathStyle: {stroke: "#ffffff"}});
//     }
//   }

//   public tryPickup(creep: Creep, resource: Resource): number {
//     return creep.pickup(resource);
//   }

//   public moveToPickup(creep: Creep, resource: Resource): void {
//     if (this.tryPickup(creep, resource) === ERR_NOT_IN_RANGE) {
//       creep.moveTo(resource, {visualizePathStyle: {stroke: "#ffffff"}});
//     }
//   }

//   public getEnergy(creep: Creep): void {
//     let containers = this.roomManager.loadContainers(creep.room);
//     if (containers.length > 0) {
//       let container = creep.pos.findClosestByPath(containers);
//       this.moveToWithdraw(creep, container);
//       return;
//     }

//     let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
//     this.moveToHarvest(creep, energySource);
//   }

//   /**
//    * Attempts transferring available resources to the creep.
//    *
//    * @export
//    * @param {Creep} creep
//    * @param {RoomObject} roomObject
//    */
//   public getEnergy(creep: Creep, roomObject: RoomObject): void {
//     let energy: Resource = <Resource> roomObject;

//     if (energy) {
//       if (creep.pos.isNearTo(energy)) {
//         creep.pickup(energy);
//       } else {
//         this.moveTo(creep, energy.pos);
//       }
//     }
//   }

//   /**
//    * Returns true if a creep's `working` memory entry is set to true, and false
//    * otherwise.
//    *
//    * @export
//    * @param {Creep} creep
//    * @returns {boolean}
//    */
//   public canWork(creep: Creep): boolean {
//     let working = creep.memory.working;

//     if (working && _.sum(creep.carry) === 0) {
//       creep.memory.working = false;
//       return false;
//     } else if (!working && _.sum(creep.carry) === creep.carryCapacity) {
//       creep.memory.working = true;
//       return true;
//     } else {
//       return creep.memory.working;
//     }
//   }

//   /**
//    * Returns true if the creep is in the "renewing" state.
//    *
//    * @export
//    * @param {Creep} creep
//    * @returns {boolean}
//    */
//   public isRenewing(creep: Creep): boolean {
//     if (this.needsRenew(creep)) {
//       creep.memory.isRenewing = true;
//       return true;
//     } else if (this.renewComplete(creep)) {
//       creep.memory.isRenewing = false;
//       return false;
//     }
//     return creep.memory.isRenewing;
//   }

//   /*##############################*/
//   /*# Energy methods to refactor #*/
//   /*##############################*/

//   public tryHarvest(creep: Creep, target: Source): number {
//     return creep.harvest(target);
//   }

//   public moveToHarvest(creep: Creep, target: Source): void {
//     if (this.tryHarvest(creep, target) === ERR_NOT_IN_RANGE) {
//       this.moveTo(creep, target.pos);
//     }
//   }

//   public tryEnergyDropOff(creep: Creep, target: Spawn | Structure): number {
//     return creep.transfer(target, RESOURCE_ENERGY);
//   }

//   public moveToDropEnergy(creep: Creep, target: Spawn | Structure): void {
//     if (this.tryEnergyDropOff(creep, target) === ERR_NOT_IN_RANGE) {
//       this.moveTo(creep, target.pos);
//     }
//   }

//   public moveToWithdraw(creep: Creep, target: Container): void {
//     if (this.tryWithdraw(creep, target) === ERR_NOT_IN_RANGE) {
//       this.moveTo(creep, target.pos);
//     }
//   }

//   public tryWithdraw(creep: Creep, target: Container): number {
//     return creep.withdraw(target, RESOURCE_ENERGY, creep.carryCapacity - _.sum(creep.carry));
//   }

//   /*###########################*/
//   /*# End of refactor methods #*/
//   /*###########################*/

//   private determineNewState(state: CreeperState) {
//     // let state = this.creep.memory.state;

//     if (state === CreeperState.Renewing) {
//       if (!this.renewComplete(this.creep)) {
//         return CreeperState.Renewing;
//       }
//     }

//     if (this.needsRenew(this.creep)) {
//       return CreeperState.Renewing;
//     }

//     if (state === CreeperState.Refueling) {
//       if (!this.refuelingComplete(this.creep)) {
//         return CreeperState.Refueling;
//       }
//     }

//     if (this.needsToRefuel(this.creep)) {
//       return CreeperState.Refueling;
//     }

//     return CreeperState.Idle;
//     /*
//     if (this.roomManager.constructionSitesExist(this.creep.room)) {
//       return CreeperState.Building;
//     }

//     // TODO: Add STATE_IDLE
//     // return STATE_IDLE;
//     return CreeperState.Building;
//     */
//   }

//   private processNextAction(state: CreeperState) {
//     if (state === CreeperState.Renewing) {
//       let spawn = this.creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
//       this.moveToRenew(this.creep, spawn);
//       return;
//     }

//     if (state === CreeperState.Refueling) {
//       this.getEnergy(this.creep);
//       return;
//     }

//     if (state === CreeperState.Building) {
//       let constructionSites = this.roomManager.loadConstructionSites(this.creep.room);
//       if (constructionSites.length > 0) {
//         let constructionSite = this.creep.pos.findClosestByPath(constructionSites);
//         this.build(this.creep, constructionSite);
//         return;
//       }

//       let damagedStructures = this.roomManager.loadDamagedStructures(this.creep.room);
//       if (damagedStructures.length > 0) {
//         let damagedStructure = this.creep.pos.findClosestByPath(damagedStructures);
//         this.moveToRepair(this.creep, damagedStructure);
//         return;
//       }
//     }
//   }
// }
