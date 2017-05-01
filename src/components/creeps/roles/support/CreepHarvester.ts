// // import * as Config from "../../../../config/config";
// // import {log} from "../../../../lib/logger/log";
// import {CreepSupport} from "./CreepSupport";
// import {RoomHandler} from "../../../rooms/RoomHandler";

// export class CreepHarvester extends CreepSupport {
//   // TODO: Change into a shared enum.
//   public readonly STATE_DELIVERING = "DELIVERING";
//   public readonly STATE_REFUELING = "REFUELING";

//   constructor (creep: Creep, roomHandler: RoomHandler) {
//     super(creep, roomHandler);
//   }

//   public run() {
//     super.run();

//     let state = this.creep.memory.state = this.determineCurrentState(this.creep);

//     if (state === this.STATE_REFUELING) {
//       let droppedEnergy = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_ENERGY,
//         {filter: (r: Resource) => r.resourceType === RESOURCE_ENERGY});
//       if (droppedEnergy) {
//         this.moveToPickup(this.creep, droppedEnergy);
//         return;
//       }

//       let energySource = this.creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
//       if (energySource) {
//         this.moveToHarvest(this.creep, energySource);
//         return;
//       }
//     }

//     if (state === this.STATE_DELIVERING) {
//       // Get path to closest container.
//       let pathToContainer = undefined;
//       let container = undefined;
//       let containers = this.creep.room.find<Container>(FIND_MY_STRUCTURES, {
//         filter: (c: Container) => (c.structureType === STRUCTURE_CONTAINER && _.sum(c.store) < c.storeCapacity),
//       });
//       // TODO: Check if doing findClosestByPath with zero length array results in undefined, null or an error.
//       if (containers.length > 0) {
//         container = this.creep.pos.findClosestByPath<Container>(containers);
//         if (container) {
//           pathToContainer = this.creep.pos.findPathTo(container);
//         }
//       }

//       // Get path to storage.
//       let pathToStorage = undefined;
//       let storage = this.creep.room.storage;
//       if (storage) {
//         pathToStorage = this.creep.pos.findPathTo(storage);
//       }

//       if (pathToContainer === undefined && pathToStorage === undefined) {
//         return;
//       }

//       if (pathToContainer === undefined) {
//         this.moveToDropEnergy(this.creep, <Storage> storage);
//         return;
//       }

//       if (pathToStorage === undefined) {
//         this.moveToDropEnergy(this.creep, <Container> container);
//         return;
//       }

//       if (pathToContainer.length < pathToStorage.length) {
//         this.moveToDropEnergy(this.creep, <Container> container);
//         return;
//       }

//       this.moveToDropEnergy(this.creep, <Storage> storage);
//       return;
//     }
//   }

//   public determineCurrentState(creep: Creep): string {
//     let state = creep.memory.state;

//     if (state === this.STATE_REFUELING) {
//       if (!this.refuelingComplete(creep)) {
//         return this.STATE_REFUELING;
//       }
//     }

//     if (this.needsToRefuel(creep)) {
//       return this.STATE_REFUELING;
//     }

//     if (this.refuelingComplete) {
//       return this.STATE_DELIVERING;
//     }

//     // TODO: Add STATE_IDLE
//     // return STATE_IDLE;
//     return this.STATE_DELIVERING;
//   }
// }
