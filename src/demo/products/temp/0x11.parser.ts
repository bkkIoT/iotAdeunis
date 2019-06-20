namespace codec {

  /**
   * Temperature 0x11 (configuration) frame parser
   */
  export class Temp0x11Parser implements FrameParser {

    readonly deviceType = 'temp';
    readonly frameCode = 0x11;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = { type: '0x11 Temperature configuration' };

      // Internal sensor high threshold configuration
      appContent['ambient_probe_high_threshold_value'] = payload.readUInt16BE(2) / 10;
      appContent['ambient_probe_high_threshold_hysteresis'] = payload[4] / 10;

      // Internal sensor low threshold configuration
      appContent['ambient_probe_low_threshold_value'] = payload.readUInt16BE(5) / 10;
      appContent['ambient_probe_low_threshold_hysteresis'] = payload[7] / 10;

      // ?
      appContent['super_sampling_factor'] = payload[8];

      return appContent;
    }

  }

}
