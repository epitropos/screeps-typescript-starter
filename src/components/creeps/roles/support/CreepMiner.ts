// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepMiner extends CreepSupport {
  public static getBodyParts(energyAvailable: number) {
    let bodyParts: string[] = [WORK, MOVE];
    let bodySegmentSize = 100;

    let bodyPartsSize = 50 + 100;
    let bodyPartsSizeMax = 50 + 100 + 100 + 100 + 100 + 100;

    while (bodyPartsSize + bodySegmentSize < energyAvailable && bodyPartsSize < bodyPartsSizeMax) {
      bodyParts.push(WORK);
      bodyPartsSize += bodySegmentSize;
    }

    // TODO: Move function into CreepSupport.
    return _.sortBy(bodyParts, function(bodyPart) {
      switch (bodyPart) {
        case CARRY: return 2;
        case MOVE: return 3;
        case WORK: return 1;
        default: return 99;
      }
    });
  }

  public containerId: string;
  public sourceId: string;

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    if (this.creep.pos !== this.creep.memory.finalDestination) {
      return;
    }

    let sourceId = this.creep.memory.sourceId;
    if (sourceId === undefined) {
      let sources = this.creep.room.find<Source>(FIND_SOURCES, {
        filter: (s: Source) => this.creep.pos.isNearTo(s),
      });
      if (sources.length > 0) {
        this.creep.memory.sourceId = sourceId = sources[0].id;
      }
    }
    if (sourceId !== undefined) {
    let source = <Source> Game.getObjectById(sourceId);
    this.tryHarvest(this.creep, source);
    }
  }
}
