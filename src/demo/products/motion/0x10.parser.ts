namespace codec {

  /**
   * Motion 0x10 (configuration) frame parser
   */
  export class Motion0x10Parser implements FrameParser {

    readonly deviceType = 'motion';
    readonly frameCode = 0x10;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      // calculated_period_recording_sec = S321 * S320 * 2
      // calculated_period_sending_sec = S321 * S320 * S301 * 2
      const appContent: Content = {
        type: '0x10 Motion configuration',
        'transmission_period_keep_alive_sec': payload.readUInt16BE(2),
        'number_of_historization_before_sending': payload.readUInt16BE(4),
        'number_of_sampling_before_historization': payload.readUInt16BE(6),
        'sampling_period_sec': payload.readUInt16BE(8) * 2,
        'presence_detector_inhibition_duration_sec': payload.readUInt16BE(10) * 10,
        'calculated_period_recording_sec': payload.readUInt16BE(8) * payload.readUInt16BE(6) * 2,
        'calculated_period_sending_sec': payload.readUInt16BE(8) * payload.readUInt16BE(6) * payload.readUInt16BE(4) * 2
      };

      return appContent;
    }

  }

}
