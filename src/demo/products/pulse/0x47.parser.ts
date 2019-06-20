namespace codec {

  /**
   * Pulse 0x47 (alarm) frame parser
   */
  export class Pulse0x47Parser implements FrameParser {

    readonly deviceType = 'pulse';
    readonly frameCode = 0x47;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = { type: '0x47 Pulse alarm' };

      // Flows when overflow occured
      appContent['channelA_flow'] = payload.readUInt16BE(2);
      appContent['channelB_flow'] = payload.readUInt16BE(4);

      return appContent;
    }

  }

}
