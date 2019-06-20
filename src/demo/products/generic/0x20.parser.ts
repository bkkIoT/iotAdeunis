namespace codec {

  /**
   * Generic 0x20 (configuration) frame parser
   */
  export class Generic0x20Parser implements FrameParser {

    readonly deviceType = 'any';
    readonly frameCode = 0x20;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      let appContent: Content = { type: '0x20 Configuration' };

      // Content depends on network
      switch (network) {
        case 'lora868':
          appContent = { ...appContent, ...this.parseLora868(payload) };
          break;
        case 'sigfox':
          appContent = { ...appContent, ...this.parseSigfox(payload) };
          break;
        // case 'unknown':
        default:
          appContent.partialDecoding = PartialDecodingReason.MISSING_NETWORK;
          break;
      }

      return appContent;
    }

    /**
     * Parse LoRa 868
     * @param payload payload
     */
    private parseLora868(payload: Buffer) {
      const appContent: Content = {};

      appContent['lora_adr'] = Boolean(payload[2] & 0x01);
      appContent['lora_provisioning_mode'] = payload[3] === 0 ? 'ABP' : 'OTAA';

      return appContent;
    }

    /**
     * Parse Sigfox
     * @param payload payload
     */
    private parseSigfox(payload: Buffer) {
      const appContent: Content = {};

      appContent['sigfox_retry'] = (payload[2] & 0x03);

      return appContent;
    }

  }

}
