namespace codec {

  /**
   * Temperature 0x10 (configuration) frame parser
   */
  export class Temp0x10Parser implements FrameParser {

    readonly deviceType = 'temp';
    readonly frameCode = 0x10;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = { type: '0x10 Temperature configuration' };

      if (payload[8] === 2) {
        // TEST mode => period = value * 20sec
        appContent['transmission_period_keep_alive_sec'] = payload[2] * 20;
        appContent['transmission_period_data_sec'] = payload[3] * 20;
      } else {
        // PRODUCTION mode => period = value * 10min
        appContent['transmission_period_keep_alive_min'] = payload[2] * 10;
        appContent['transmission_period_data_min'] = payload[3] * 10;
      }

      // Internal sensor general configuration
      appContent['ambient_probe_id'] = payload[4];
      appContent['ambient_probe_threshold_triggering'] = this.getThresholdTriggeringText(payload[5] & 0x03);

      // External sensor general configuration
      appContent['remote_probe_id'] = payload[6];
      appContent['remote_probe_threshold_triggering'] = this.getThresholdTriggeringText(payload[7] & 0x03);

      // Product mode
      appContent['product_mode'] = PlateformCommonUtils.getProductModeText(payload[8]);

      // ?
      appContent['sensors_activation'] = payload[9];

      if (payload[8] === 2) {
        // TEST mode => period = value * 20sec
        appContent['acquisition_period_sec'] = payload[10] * 20;
      } else {
        // PRODUCTION mode => period = value * 10min
        appContent['acquisition_period_min'] = payload[10] * 10;
      }

      return appContent;
    }

    /**
     * Get Threshold Triggering text
     * @param value value
     */
    private getThresholdTriggeringText(value: number) {
      switch (value) {
        case 0:
          return 'none';
        case 1:
          return 'low_only';
        case 2:
          return 'high_only';
        case 3:
          return 'low_and_high';
        default:
          return '';
      }
    }

  }

}
