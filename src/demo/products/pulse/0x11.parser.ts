namespace codec {

  /**
   * Pulse 0x11 (configuration) frame parser
   */
  export class Pulse0x11Parser implements FrameParser {

    readonly deviceType = 'pulse';
    readonly frameCode = 0x11;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = { type: '0x11 Pulse configuration' };

      // Overflow alarm trigger threshold
      appContent['channelA_leakage_detection_overflow_alarm_trigger_threshold'] = payload.readUInt16BE(2);
      appContent['channelB_leakage_detection_overflow_alarm_trigger_threshold'] = payload.readUInt16BE(4);

      // Leakage threshold
      appContent['channelA_leakage_detection_threshold'] = payload.readUInt16BE(6);
      appContent['channelB_leakage_detection_threshold'] = payload.readUInt16BE(8);

      return appContent;
    }

  }

}
