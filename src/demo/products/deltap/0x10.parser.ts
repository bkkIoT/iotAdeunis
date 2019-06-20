namespace codec {

  /**
   * Delta P 0x10 (configuration) frame parser
   */
  export class Deltap0x10Parser implements FrameParser {

    readonly deviceType = 'deltap';
    readonly frameCode = 0x10;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      // register 300: Emission period of the life frame
      // register 301: Issue period, value betwenn 0 and 65535, 0: disabling periodic transmission
      // register 320: value betwenn 1 and 65535
      // register 321: value betwenn 0 and 65535, 0: no scanning, X2s
      // reading_frequency = S321 * S320
      // sending_frequency = S321 * S320 * S301
      const appContent: Content = {
        type: '0x10 Delta P configuration',
        'transmission_period_keep_alive_sec': payload.readUInt16BE(2) * 10,
        'number_of_historization_before_sending': payload.readUInt16BE(4),
        'number_of_sampling_before_historization': payload.readUInt16BE(6),
        'sampling_period_sec': payload.readUInt16BE(8) * 2,
        'calculated_period_recording_sec': payload.readUInt16BE(8) * payload.readUInt16BE(6) * 2,
        'calculated_period_sending_sec': payload.readUInt16BE(8) * payload.readUInt16BE(6) * payload.readUInt16BE(4) * 2
      };

      return appContent;
    }

  }

}
