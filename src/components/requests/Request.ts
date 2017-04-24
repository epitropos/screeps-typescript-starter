class MyRequest {
  // TODO: Create different types of requests that serialize their payload, and contain a function
  // that says "Yes the specified recipient is a valid recipient".
  public requestId: string;
  public creepId: string;
  public structureId: string;

  constructor () {
    this.requestId = "request_" + _.random();
  }
}
