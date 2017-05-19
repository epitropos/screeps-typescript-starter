// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepExtractor extends CreepSupport {
  public static MinimumEnergyRequired = 100;

  public static getBodyParts(energyAvailable: number) {
    if (energyAvailable < CreepExtractor.MinimumEnergyRequired) {
      return undefined;
    }

    let bodyParts: string[] = [WORK, MOVE];
    let bodySegmentSize = 100;

    let bodyPartsSize = 150;

    while (bodyPartsSize + bodySegmentSize < energyAvailable) {
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
  public mineralId: string;

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    this.containerId = this.creep.memory.containerId;
    if (this.containerId === undefined) {
      return;
    }

    this.mineralId = this.creep.memory.mineralId;
    if (this.mineralId === undefined) {
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

    if (this.mineralId === undefined) {
      let minerals = this.creep.room.find<Mineral>(FIND_MINERALS, {
        filter: (s: Mineral) => this.creep.pos.isNearTo(s),
      });
      if (minerals.length > 0) {
        let mineral = minerals[0];
        this.mineralId = mineral.id;
        this.creep.memory.mineralId = mineral.id;
      }
    }

    let mineral = <Mineral> Game.getObjectById(this.mineralId);
    if (!mineral || mineral.mineralAmount === 0) {
      // TODO: return creep to spawn and recycle it.
      this.creep.suicide();
      return;
    }

    this.tryHarvestMineral(this.creep, mineral);
  }
}
