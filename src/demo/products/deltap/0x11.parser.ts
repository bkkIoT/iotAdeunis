namespace codec {

  /**
   * Delta P 0x11 (0-10V configuration) frame parser
   */
  export class Deltap0x11Parser implements FrameParser {

    readonly deviceType = 'deltap';
    readonly frameCode = 0x11;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      // register 322: value betwenn 1 and 65535
      // register 323: value betwenn 0 and 65535, 0: no scanning, X2s
      // register 324: Issue period, value betwenn 0 and 65535, 0: disabling periodic transmission
      // reading_frequency = S322 * S323
      // sending_frequency = S322 * S323 * S324
      const appContent: Content = {
        type: '0x11 Delta P 0-10V configuration',
        'number_of_sampling_before_historization': payload.readUInt16BE(2),
        'sampling_period_sec': payload.readUInt16BE(4) * 2,
        'number_of_historization_before_sending': payload.readUInt16BE(6),
        'calculated_period_recording_sec': payload.readUInt16BE(2) * payload.readUInt16BE(4) * 2,
        'calculated_period_sending_sec': payload.readUInt16BE(2) * payload.readUInt16BE(4) * payload.readUInt16BE(6) * 2
      };

      return appContent;
    }

  }

}
