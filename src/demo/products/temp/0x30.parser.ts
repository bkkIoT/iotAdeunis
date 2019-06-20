namespace codec {

  /**
   * Temperature 0x30 (keep alive) frame parser
   */
  export class Temp0x30Parser implements FrameParser {

    readonly deviceType = 'temp';
    readonly frameCode = 0x30;

    private temp0x43Parser = new Temp0x43Parser();

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent = this.temp0x43Parser.parseFrame(payload, configuration, network);

      appContent['type'] = '0x30 Temperature keep alive';

      return appContent;
    }

  }

}
