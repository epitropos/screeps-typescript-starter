class RoomHandler {
  public room: Room;
  public miners: CreepMiner[] = [];
  public haulers: CreepHauler[] = [];
  public builders: CreepBuilder[] = [];
  public upgraders: CreepUpgrader[] = [];
  public extractors: CreepExtractor[] = [];

  public harvesters: CreepHarvester[] = [];
  public carriers: CreepCarrier[] = [];

  constructor (room: Room) {
    this.room = room;
  }

  public run() {
    this.miners = this.loadCreeps(this.room, CreepType.Miner);
    this.haulers = this.loadCreeps(this.room, CreepType.Hauler);
    this.builders = this.loadCreeps(this.room, CreepType.Builder);
    this.upgraders = this.loadCreeps(this.room, CreepType.Upgrader);
    this.extractors = this.loadCreeps(this.room, CreepType.Extractor);

    this.harvesters = this.loadCreeps(this.room, CreepType.Harvester);
    this.carriers = this.loadCreeps(this.room, CreepType.Carrier);
  }

  private loadCreeps(room: Room, creepType: CreepType) {
    switch(creepType) {
      case CreepType.Builder:
        return room.find(FIND_MY_CREEPS,
        { filter: (c: Creep) => c.memory.role === CreepType.Builder});
      default: return null;
    }
    // let creeps = room.find(FIND_MY_CREEPS);
    // switch (creepType) {
    //   case CreepType.Builder: return _.filter(creeps, (c) => c.memory.role === CreepType.Builder);
    //   case CreepType.Carrier: return _.filter()
    //   default:
    //     break;
    // };
    // return creeps;
  }
}
