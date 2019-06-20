namespace codec {

  /**
   * Smart Building 0x1f (TOR configuration) frame parser
   */
  export class Sb0x1fParser implements FrameParser {

    readonly deviceType = 'any';
    readonly frameCode = 0x1f;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      // register 380: Configuration TOR1 (button)
      // register 381: Alarm threshold TOR1
      // register 382: Configuration TOR2 (button)
      // register 383: Alarm threshold TOR2
      const appContent: Content = {
        type: '0x1f Smart Building channels configuration',
        'channel1_configuration_type': this.getTypeText(payload[2] & 0x0f),
        'channel1_configuration_debounce_duration': this.getDebounceDurationText((payload[2] & 0xf0) >> 4),
        'channel1_alarm_threshold': payload.readUInt16BE(3),
        'channel2_configuration_type': this.getTypeText(payload[5] & 0x0f),
        'channel2_configuration_debounce_duration': this.getDebounceDurationText((payload[5] & 0xf0) >> 4),
        'channel2_alarm_threshold': payload.readUInt16BE(6)
      };

      return appContent;
    }

    /**
     * Get debounce duration text
     * @param value value
     */
    private getDebounceDurationText(value: number) {
      switch (value) {
        case 0x0:
          return 'no_debounce';
        case 0x1:
          return '10msec';
        case 0x2:
          return '20msec';
        case 0x3:
          return '50msec';
        case 0x4:
          return '100msec';
        case 0x5:
          return '200msec';
        case 0x6:
          return '500msec';
        case 0x7:
          return '1s';
        case 0x8:
          return '2s';
        case 0x9:
          return '5s';
        case 0xa:
          return '10s';
        case 0xb:
          return '20s';
        case 0xc:
          return '40s';
        case 0xd:
          return '60s';
        case 0xe:
          return '5min';
        case 0xf:
          return '10min';
        default:
          return '';
      }
    }

    /**
     * Get type text
     * @param value value
     */
    private getTypeText(value: number) {
      switch (value) {
        case 0x0:
          return 'deactivated';
        case 0x1:
          return 'event_on';
        case 0x2:
          return 'event_off';
        case 0x3:
          return 'event_on_off';
        default:
          return '';
      }
    }

  }

}
