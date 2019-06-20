namespace codec {

  /**
   * Generic 0x10 (configuration) frame parser
   */
  export class Generic0x10Parser implements FrameParser {

    readonly deviceType = 'any';
    readonly frameCode = 0x10;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      return { type: '0x10 Configuration' };
    }

  }

}
