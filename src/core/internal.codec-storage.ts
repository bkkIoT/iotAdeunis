namespace codec {

  /**
   * Internal codec storage
   */
  export class InternalCodecStorage implements CodecStorage {

    private store: { [key: string]: string } = {};

    public getItem(key: string) {
      return this.store[key];
    }

    public removeItem(key: string) {
      delete this.store[key];
    }

    public setItem(key: string, value: string) {
      this.store[key] = value;
    }

  }

}
