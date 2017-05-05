// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepExtractor extends CreepSupport {
  public static getBodyParts(energyAvailable: number) {
    let bodyParts: string[] = [];
    let bodySegmentSize = 100;

    let bodyPartsSize = 0;

    while (bodyPartsSize + bodySegmentSize < energyAvailable) {
      bodyParts.push(WORK);
      bodyParts.push(MOVE);
      bodyPartsSize += bodySegmentSize;
    }

    // TODO: Move function into CreepSupport.
    return _.sortBy(bodyParts, function(bodyPart) {
      switch (bodyPart) {
        case MOVE: return 2;
        case WORK: return 1;
        default: return 99;
      }
    });
  }

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public containerId: string;
  public sourceId: string;

  public run() {
    super.run();

    this.containerId = this.creep.memory.containerId;
    if (this.containerId === undefined) {
      return;
    }

    this.sourceId = this.creep.memory.sourceId;
    if (this.sourceId === undefined) {
      return;
    }

    let container = <Container> Game.getObjectById(this.containerId);
    let inPosition = this.creep.pos.x === container.pos.x
      && this.creep.pos.y === container.pos.y
      && this.creep.pos.roomName === container.pos.roomName;
    if (!inPosition) {
      this.moveTo(this.creep, container);
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

    this.tryHarvest(this.creep, <Source> Game.getObjectById(this.sourceId));
  }
}
