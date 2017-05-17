export class RoomBase {
  public room: Room;
  public sources: Source[];
  public minerals: Mineral[];

  constructor(room: Room) {
    this.room = room;
    this.sources = room.find<Source>(FIND_SOURCES);
    this.minerals = room.find<Mineral>(FIND_MINERALS);
  }

  public run() {
    // TODO: Code goes here.
  }
}
