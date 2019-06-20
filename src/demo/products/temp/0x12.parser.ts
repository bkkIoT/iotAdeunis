namespace codec {

  /**
   * Temperature 0x12 (configuration) frame parser
   */
  export class Temp0x12Parser implements FrameParser {

    readonly deviceType = 'temp';
    readonly frameCode = 0x12;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = { type: '0x12 Temperature configuration' };

      // External sensor high threshold configuration
      appContent['remote_probe_high_threshold_value'] = payload.readUInt16BE(2) / 10;
      appContent['remote_probe_high_threshold_hysteresis'] = payload[4] / 10;

      // External sensor low threshold configuration
      appContent['remote_probe_low_threshold_value'] = payload.readUInt16BE(5) / 10;
      appContent['remote_probe_low_threshold_hysteresis'] = payload[7] / 10;

      return appContent;
    }

  }

}
