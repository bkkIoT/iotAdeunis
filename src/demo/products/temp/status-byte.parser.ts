namespace codec {

  /**
   * Temperature status byte parser
   */
  export class TempStatusByteParser implements FrameParser {

    readonly deviceType = 'temp';
    readonly frameCode = -1;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const statusContent: Content = {};

      // Status byte, applicative flags
      statusContent['ambient_probe_alarm'] = ((payload[1] & 0x08) !== 0) ? true : false;
      statusContent['remote_probe_alarm'] = ((payload[1] & 0x10) !== 0) ? true : false;

      return statusContent;
    }

  }

}
