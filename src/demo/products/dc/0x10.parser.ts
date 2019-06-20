namespace codec {

  /**
   * Dry Contacts 0x10 (configuration) frame parser
   */
  export class Dc0x10Parser implements FrameParser {

    readonly deviceType = 'dc';
    readonly frameCode = 0x10;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = { type: '0x10 Dry Contacts configuration' };

      if (payload[8] === 2) {
        // TEST mode => period = value * 20sec
        appContent['transmission_period_keep_alive_sec'] = payload[2] * 20;
        appContent['transmission_period_event_counters_sec'] = payload[3] * 20;
      } else {
        // PRODUCTION mode => period = value * 10min
        appContent['transmission_period_keep_alive_min'] = payload[2] * 10;
        appContent['transmission_period_event_counters_min'] = payload[3] * 10;
      }

      // Channel x configuration
      // payload[y]<3:0> => type
      // payload[y]<7:4> => waiting period duration

      // Channel A configuration
      appContent['channelA_type'] = this.getTypeText(payload[4] & 0x0f);
      appContent['channelA_waiting_period_duration'] = this.getWaitingPeriodDurationText((payload[4] & 0xf0) >> 4);

      // Channel B configuration
      appContent['channelB_type'] = this.getTypeText(payload[5] & 0x0f);
      appContent['channelB_waiting_period_duration'] = this.getWaitingPeriodDurationText((payload[5] & 0xf0) >> 4);

      // Channel C configuration
      appContent['channelC_type'] = this.getTypeText(payload[6] & 0x0f);
      appContent['channelC_waiting_period_duration'] = this.getWaitingPeriodDurationText((payload[6] & 0xf0) >> 4);

      // Channel D configuration
      appContent['channelD_type'] = this.getTypeText(payload[7] & 0x0f);
      appContent['channelD_waiting_period_duration'] = this.getWaitingPeriodDurationText((payload[7] & 0xf0) >> 4);

      // Product mode
      appContent['product_mode'] = PlateformCommonUtils.getProductModeText(payload[8]);

      return appContent;
    }

    /**
     * Get Type text
     * @param value value
     */
    private getTypeText(value: number) {
      switch (value) {
        case 0:
          return 'disabled';
        case 1:
          return 'in_periodic_mode_high_edge';
        case 2:
          return 'in_periodic_mode_low_edge';
        case 3:
          return 'in_periodic_mode_high_and_low_edge';
        case 4:
          return 'in_event_mode_high_edge';
        case 5:
          return 'in_event_mode_low_edge';
        case 6:
          return 'in_event_mode_high_and_low_edge';
        case 7:
          return 'out_default_state_1close';
        case 8:
          return 'out_default_state_0open';
        default:
          return '';
      }
    }

    /**
     * Get Waiting Period Duration text
     * @param value value
     */
    private getWaitingPeriodDurationText(value: number) {
      switch (value) {
        case 0:
          return 'no_debounce';
        case 1:
          return '10msec';
        case 2:
          return '20msec';
        case 3:
          return '50msec';
        case 4:
          return '100msec';
        case 5:
          return '200msec';
        case 6:
          return '500msec';
        case 7:
          return '1sec';
        case 8:
          return '2sec';
        case 9:
          return '5sec';
        case 10:
          return '10sec';
        case 11:
          return '20sec';
        case 12:
          return '40sec';
        case 13:
          return '60sec';
        case 14:
          return '5min';
        default:
          return '';
      }
    }

  }

}
