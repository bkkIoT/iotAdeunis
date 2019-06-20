namespace codec {

  /**
   * Temperature 0x43 (data) frame parser
   */
  export class Temp0x43Parser implements FrameParser {

    readonly deviceType = 'temp';
    readonly frameCode = 0x43;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = { type: '0x43 Temperature data' };

      // Internal sensor input states
      appContent['ambient_probe_id'] = (payload[2] & 0xf0) >> 4;
      const rawInternalValue = payload.readInt16BE(3);
      if (rawInternalValue === 0x8000) {
        appContent['ambient_probe_defect'] = true;
      } else {
        // value in °C = frame value / 10
        appContent['ambient_temperature_celsius_degrees'] = rawInternalValue / 10;
      }

      // External sensor input states
      appContent['remote_probe_id'] = (payload[5] & 0xf0) >> 4;
      const rawExternalValue = payload.readInt16BE(6);
      if (rawExternalValue === 0x8000) {
        appContent['ambient_probe_defect'] = true;
      } else {
        // value in °C = frame value / 10
        appContent['remote_temperature_celsius_degrees'] = rawExternalValue / 10;
      }

      return appContent;
    }

  }

}
