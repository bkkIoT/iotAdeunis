namespace codec {

  /**
   * Comfort status byte parser
   */
  export class ComfortStatusByteParser implements FrameParser {

    readonly deviceType = 'comfort';
    readonly frameCode = -1;

    public parseFrame(payload: Buffer, configuration: Buffer) {
      const statusContent: Content = {};

      // Status byte, applicative flags
      statusContent['configuration_inconsistency'] = ((payload[1] & 0x08) !== 0) ? true : false;

      return statusContent;
    }

  }

}
