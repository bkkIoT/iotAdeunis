namespace codec {

  /**
   * Motion 0x4e (historic data) frame parser
   */
  export class Motion0x4eParser implements FrameParser {

    readonly deviceType = 'motion';
    readonly frameCode = 0x4e;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = {
        type: '0x4e Motion data',
        'presence_global_counter': payload.readUInt16BE(2),
        'presence_current_counter': payload.readUInt16BE(4),
        'luminosity_current_percentage': payload[6],
        ...this.getHistoricDataFromPayload(payload, configuration)
      };

      return appContent;
    }

    /**
     * Get historic data from payload
     * @param payload payload
     * @param configuration configuration
     */
    private getHistoricDataFromPayload(payload: Buffer, configuration: Buffer) {
      const appContent: Content = {};

      // Loop through historic data (if present)
      for (let offset = 7; offset < payload.byteLength; offset += 3) {
        const index = (offset - 4) / 3;
        const timeText = this.getTimeText(index);
        appContent[`presence_${timeText}_counter`] = payload.readUInt16BE(offset);
        appContent[`luminosity_${timeText}_percentage`] = payload[offset + 2];
      }

      return appContent;
    }

    /**
     * Get reading frequency
     * @param configuration configuration
     */
    private getReadingFrequency(configuration: Buffer) {
      return configuration.byteLength > 0 ? configuration.readUInt16BE(8) * configuration.readUInt16BE(6) * 2 : null;
    }

    /**
     * Get time text
     * @param readingFrequency reading frequency
     * @param index index
     */
    private getTimeText(index: number) {
      const time = `tminus${index}`;
      return time;
    }

  }

}
