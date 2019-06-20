namespace codec {

  /**
   * Pulse 0x12 (configuration) frame parser
   */
  export class Pulse0x12Parser implements FrameParser {

    readonly deviceType = 'pulse';
    readonly frameCode = 0x12;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = { type: '0x12 Pulse configuration' };

      // Daily periods below which leakage alarm triggered
      appContent['channelA_leakage_detection_daily_periods_below_which_leakage_alarm_triggered']
        = payload.readUInt16BE(2);
      appContent['channelB_leakage_detection_daily_periods_below_which_leakage_alarm_triggered']
        = payload.readUInt16BE(4);

      return appContent;
    }

  }

}
