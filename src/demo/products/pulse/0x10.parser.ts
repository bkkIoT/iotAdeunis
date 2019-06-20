namespace codec {

  /**
   * Pulse 0x10 (configuration) frame parser
   */
  export class Pulse0x10Parser implements FrameParser {

    readonly deviceType = 'pulse';
    readonly frameCode = 0x10;

    private pulse0x11Parser = new Pulse0x11Parser();
    private pulse0x12Parser = new Pulse0x12Parser();

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      let appContent: Content = { type: '0x10 Pulse configuration' };

      // Product mode
      appContent['product_mode'] = PlateformCommonUtils.getProductModeText(payload[2]);

      // Infer network from frame
      const inferredNetwork = this.inferNetwork(payload.byteLength);

      // Resolve known netowrk
      const knownNetwork = network === 'unknown' ? inferredNetwork : network;

      // Transmission period
      let offset = 0;
      if (payload[8] === 2) {
        // TEST mode => period = value * 20sec
        if (knownNetwork === 'sigfox') {
          appContent['transmission_period_sec'] = payload[3] * 20;
          offset = -1; // value is on 1 byte for Sigfox, shift further payload reading
        } else {
          appContent['transmission_period_sec'] = payload.readUInt16BE(3) * 20;
        }
      } else {
        // PRODUCTION mode
        if (knownNetwork === 'sigfox') {
          // Sigfox: period = value * 10min
          appContent['transmission_period_min'] = payload[3] * 10;
          offset = -1; // value is on 1 byte for Sigfox, shift further payload reading
        } else {
          // LoRa 868: period = value * 1min
          appContent['transmission_period_min'] = payload.readUInt16BE(3);
        }
      }

      // Channels configuration
      appContent = { ...appContent, ...this.parseChannelsGeneralConfiguration(payload, offset) };

      // Historic mode
      appContent['historic_mode'] = this.getHistoricModeText(payload[offset + 6]);

      // Debouncing periods
      appContent['channelA_configuration_debouncing_period'] =
        this.getDebouncingPeriodText(payload[offset + 7] & 0x0f);
      appContent['channelB_configuration_debouncing_period'] =
        this.getDebouncingPeriodText((payload[offset + 7] & 0xf0) >> 4);

      // Flow calculation period
      if (payload[8] === 2) {
        // TEST mode => period = value * 20sec
        appContent['flow_calculation_period_sec'] = payload.readUInt16BE(offset + 8) * 20;
      } else {
        // PRODUCTION mode => period = value * 1min
        appContent['flow_calculation_period_min'] = payload.readUInt16BE(offset + 8);
      }

      if (knownNetwork === 'unknown') {
        appContent.partialDecoding = PartialDecodingReason.MISSING_NETWORK;
      } else if (knownNetwork === 'lora868') {
        // Parse using 0x11 and 0x12 frame parsers
        appContent = { ...appContent, ...this.parseUsing0x11(payload, knownNetwork) };
        appContent = { ...appContent, ...this.parseUsing0x12(payload, knownNetwork) };
      }

      return appContent;
    }

    /**
     * Infer network
     * @param length frame length
     */
    private inferNetwork(length: number) {
      //            +--------------+
      //            | Frame length |
      // +----------+--------------+
      // | LoRa 868 |           22 |
      // | Sigfox   |            9 |
      // +----------+--------------+
      switch (length) {
        case 22:
          return 'lora868' as Network;
        case 9:
          return 'sigfox' as Network;
        default:
          return 'unknown' as Network;
      }
    }

    /**
     * Parse channel configuration
     * @param payload payload
     * @param offset offset
     */
    private parseChannelsGeneralConfiguration(payload: Buffer, offset: number) {
      const appContent: Content = {};

      // Channel A
      appContent['channelA_configuration_state'] = this.getStateText(Boolean(payload[offset + 5] & 0x01));
      appContent['channelA_configuration_type'] = this.getTypeText(Boolean(payload[offset + 5] & 0x02));
      appContent['channelA_configuration_tamper_activated'] = Boolean(payload[offset + 5] & 0x08);

      // Channel B
      appContent['channelB_configuration_state'] = this.getStateText(Boolean(payload[offset + 5] & 0x10));
      appContent['channelB_configuration_type'] = this.getTypeText(Boolean(payload[offset + 5] & 0x20));
      appContent['channelB_configuration_tamper_activated'] = Boolean(payload[offset + 5] & 0x80);

      return appContent;
    }

    /**
     * Get state text
     * @param value value
     */
    private getStateText(value: boolean) {
      return value ? 'enabled' : 'disabled';
    }

    /**
     * Get type text
     * @param value value
     */
    private getTypeText(value: boolean) {
      return value ? 'gas_pull_up_on' : 'other_pull_up_off';
    }

    /**
     * Get historic mode text
     * @param value value
     */
    private getHistoricModeText(value: number) {
      switch (value) {
        case 0:
          return 'no_historic';
        case 1:
          return 'historic_log_every_10min';
        case 2:
          return 'historic_log_every_1h';
        default:
          return '';
      }
    }

    /**
     * Get debouncing period text
     * @param value value
     */
    private getDebouncingPeriodText(value: number) {
      switch (value) {
        case 0:
          return 'no_debounce';
        case 1:
          return '1msec';
        case 2:
          return '10msec';
        case 3:
          return '20msec';
        case 4:
          return '50msec';
        case 5:
          return '100msec';
        case 6:
          return '200msec';
        case 7:
          return '500msec';
        case 8:
          return '1s';
        case 9:
          return '2s';
        case 10:
          return '5s';
        case 11:
          return '10s';
        default:
          return '';
      }
    }

    /**
     * Parse using 0x11 frame parser
     * @param payload payload
     * @param network network: unknown, lora868 or sigfox
     * @param offset offset
     */
    private parseUsing0x11(payload: Buffer, network: Network) {
      // concat method is not supported by shim => use a basic method instead
      // var payloadWith0x11 = Buffer.concat([Buffer.from([0x11, 0x00]), payload.slice(10, 18)]);
      const payloadWith0x11 = payload.slice(8, 18);
      payloadWith0x11.writeUInt16BE(0x1100, 0);
      const appContent = this.pulse0x11Parser.parseFrame(payloadWith0x11, payload, network);
      delete appContent['type'];
      return appContent;
    }

    /**
     * Parse using 0x12 frame parser
     * @param payload payload
     * @param network network: unknown, lora868 or sigfox
     * @param offset offset
     */
    private parseUsing0x12(payload: Buffer, network: Network) {
      // concat method is not supported by shim => use a basic method instead
      // var payloadWith0x12 = Buffer.concat([Buffer.from([0x12, 0x00]), payload.slice(18, 22)]);
      const payloadWith0x12 = payload.slice(16, 22);
      payloadWith0x12.writeUInt16BE(0x1200, 0);
      const appContent = this.pulse0x12Parser.parseFrame(payloadWith0x12, payload, network);
      delete appContent['type'];
      return appContent;
    }

  }

}
