// import * as Config from "../../../../config/config";
import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepMiner extends CreepSupport {
  // public containerPosition: RoomPosition;
  public containerId: string;
  public sourceId: string;

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    // this.containerPosition = this.creep.memory.containerPosition;
    // log.info("containerPosition: " + this.containerPosition);
    // if (this.containerPosition === undefined) {
    //   log.info("containerPosition missing for " + this.creep.name);
    //   return;
    // } else {
    //   log.info("containerPosition: (" + this.containerPosition.x + ", " + this.containerPosition.y) + ")";
    // }

    this.containerId = this.creep.memory.containerId;
    log.info("containerId: " + this.containerId);
    if (this.containerId === undefined) {
      log.info("containerId missing for " + this.creep.name);
      return;
    } else {
      log.info("containerId: " + this.containerId);
    }




    this.sourceId = this.creep.memory.sourceId;
    log.info("sourceId: " + this.sourceId);
    if (this.sourceId === undefined) {
      log.info("sourceId missing for " + this.creep.name);
      return;
    } else {
      log.info("sourceId: " + this.sourceId);
    }

    let container = <Container> Game.getObjectById(this.containerId);
    let inPosition = this.creep.pos.x === container.pos.x
      && this.creep.pos.y === container.pos.y
      && this.creep.pos.roomName === container.pos.roomName;
    log.info("inPosition: " + inPosition);
    if (!inPosition) {
      log.info("moveTo: (" + container.pos.x + ", " + container.pos.y + ")");
      this.moveTo(this.creep, container);
    // // } else if (this.sourceId === undefined) {
    // //   let resources = this.creep.room.find<Source>(FIND_SOURCES);
    // //   log.info("resources: " + resources.length);
    // //   for (let resource of resources) {
    // //     if (this.creep.pos.isNearTo(resource)) {
    // //       this.sourceId = this.creep.memory.sourceId = (<Source> resource).id;
    // //       break;
    // //     }
    // //   }
      return;
    }

    if (this.sourceId === undefined) {
      let sources = this.creep.room.find<Source>(FIND_SOURCES, {
        filter: (s: Source) => this.creep.pos.isNearTo(s),
      });
      if (sources.length > 0) {
        let source = sources[0];
        this.sourceId = source.id;
        this.creep.memory.sourceId = source.id;
      }
    }

    log.info("tryHarvest: " + this.sourceId);
    this.tryHarvest(this.creep, <Source> Game.getObjectById(this.sourceId));
  }
}
