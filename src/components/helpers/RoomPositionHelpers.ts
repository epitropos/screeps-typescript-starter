export class RoomPositionHelpers {
  public getNextToPosition(startingPosition: RoomPosition, endingPosition: RoomPosition) {
    let path = startingPosition.findPathTo(endingPosition);
    if (path.length === 0) {
      return startingPosition;
    }
    let step = path[path.length - 1];
    let nextToPosition = new RoomPosition(
      step.x,
      step.y,
      endingPosition.roomName
    );
    return nextToPosition;
  }
}
