namespace codec {

  /**
   * Generic 0x30 (keep alive) frame parser
   */
  export class Generic0x30Parser implements FrameParser {

    readonly deviceType = 'any';
    readonly frameCode = 0x30;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: any = { type: '0x30 Keep alive' };

      return appContent;
    }

  }

}
