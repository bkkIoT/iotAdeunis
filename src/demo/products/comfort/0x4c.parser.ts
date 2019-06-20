namespace codec {

  /**
   * Comfort 0x4c (historic data) frame parser
   */
  export class Comfort0x4cParser implements FrameParser {

    readonly deviceType = 'comfort';
    readonly frameCode = 0x4c;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = {
        type: '0x4c Comfort data',
        'instantaneous_temperature_celsius_degrees': payload.readInt16BE(2) / 10,
        'humidity_current_percentage': payload.readUInt8(4),
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
      for (let offset = 5; offset < payload.byteLength; offset += 3) {
        const index = (offset - 2) / 3;
        const timeText = this.getTimeText(index);
        appContent[`temperature_${timeText}_celsius_degrees`] = payload.readInt16BE(offset) / 10;
        appContent[`humidity_${timeText}_percentage`] = payload[offset + 2];
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
