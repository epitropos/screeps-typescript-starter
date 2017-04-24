class GameHandler {
  public game: Game;
  // public roomHandlers: {name: string, room: Room}[] = [];
  // public ownedRoomHandlers: {name: string, room: RoomOwned}[] = [];
  // public neutralRoomHandlers: {name: string, room: RoomNeutral}[] = [];
  // public enemyRoomHandlers: {name: string, room: RoomEnemy}[] = [];
  // public allyRoomHandlers: {name: string, room: RoomAlly}[] = [];

  constructor (game: Game) {
    this.game = game;
  }

  public run() {
    // TODO: Check for requests.

    this.loadDefaults();

    // for (let roomName in Game.rooms) {
    //   let spawns = Game.rooms[roomName];
    //   if (spawns) {
    //     this.ownedRoomHandlers.push({roomName, new RoomOwned(room)});
    //   }
    // }
  }

  public loadDefaults() {
    this.loadDefaultMaximumBuilders();
    this.loadDefaultMaximumHarvesters();
    this.loadDefaultMaximumUpgraders();
    this.loadDefaultMaximumMiners();
    this.loadDefaultMaximumHaulers();
  }

  public loadDefaultMaximumBuilders() {
    let maximumBuilders = Memory.defaults.populaton.maximum.builders;
    if (!maximumBuilders) {
      Memory.defaults.populaton.maximum.builders = 1;
    }
  }

  public loadDefaultMaximumHarvesters() {
    let maximumHarvesters = Memory.defaults.populaton.maximum.harvesters;
    if (!maximumHarvesters) {
      Memory.defaults.populaton.maximum.harvesters = 1;
    }
  }

  public loadDefaultMaximumUpgraders() {
    let maximumUpgraders = Memory.defaults.populaton.maximum.upgraders;
    if (!maximumUpgraders) {
      Memory.defaults.populaton.maximum.upgraders = 1;
    }
  }

  public loadDefaultMaximumMiners() {
    let maximumMiners = Memory.defaults.populaton.maximum.miners;
    if (!maximumMiners) {
      Memory.defaults.populaton.maximum.miners = 1;
    }
  }

  public loadDefaultMaximumHaulers() {
    let maximumHaulers = Memory.defaults.populaton.maximum.haulers;
    if (!maximumHaulers) {
      Memory.defaults.populaton.maximum.haulers = 1;
    }
  }
}
