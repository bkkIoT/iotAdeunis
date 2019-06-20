namespace codec {

  /**
   * Generic status byte parser
   */
  export class GenericStatusByteParser implements FrameParser {

    readonly deviceType = 'any';
    readonly frameCode = -1;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const statusContent: Content = {};

      statusContent['frame_counter'] = (payload[1] & 0xe0) >> 5;
      statusContent['hardware_error'] = ((payload[1] & 0x04) !== 0) ? true : false;
      statusContent['low_battery'] = ((payload[1] & 0x02) !== 0) ? true : false;
      statusContent['configuration_done'] = ((payload[1] & 0x01) !== 0) ? true : false;

      return statusContent;
    }

  }

}
