class Cache {
  public _cacheMap = {};
  public randomId: number;

  constructor () {
    this.randomId = parseInt(Math.random()*10000);
  }
}
