namespace codec {

  /**
   * Dry Contacts 0x40 (data) frame parser
   */
  export class Dc0x40Parser implements FrameParser {

    readonly deviceType = 'dc';
    readonly frameCode = 0x40;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = { type: '0x40 Dry Contacts data' };

      // Channel A states
      const channelAType = configuration[4] & 0x0f;
      if (channelAType !== 0x07 && channelAType !== 0x08) {
        // Channel A type is output
        appContent['channelA_event_counter'] = payload.readUInt16BE(2);
      }
      appContent['channelA_current_state'] = Boolean(payload[10] & 0x01);
      appContent['channelA_previous_frame_state'] = Boolean(payload[10] & 0x02);

      // Channel B states
      const channelBType = configuration[5] & 0x0f;
      if (channelBType !== 0x07 && channelBType !== 0x08) {
        // Channel B type is output
        appContent['channelB_event_counter'] = payload.readUInt16BE(4);
      }
      appContent['channelB_current_state'] = Boolean(payload[10] & 0x04);
      appContent['channelB_previous_frame_state'] = Boolean(payload[10] & 0x08);

      // Channel C states
      const channelCType = configuration[6] & 0x0f;
      if (channelCType !== 0x07 && channelCType !== 0x08) {
        // Channel C type is output
        appContent['channelC_event_counter'] = payload.readUInt16BE(6);
      }
      appContent['channelC_current_state'] = Boolean(payload[10] & 0x10);
      appContent['channelC_previous_frame_state'] = Boolean(payload[10] & 0x20);

      // Channel D states
      const channelDType = configuration[7] & 0x0f;
      if (channelDType !== 0x07 && channelDType !== 0x08) {
        // Channel D type is output
        appContent['channelD_event_counter'] = payload.readUInt16BE(8);
      }
      appContent['channelD_current_state'] = Boolean(payload[10] & 0x40);
      appContent['channelD_previous_frame_state'] = Boolean(payload[10] & 0x80);

      if (configuration.byteLength < 8) {
        // Report that decoding may be inaccurate as whole configuration was not available
        appContent.partialDecoding = PartialDecodingReason.MISSING_CONFIGURATION;
      }

      return appContent;
    }

  }

}
