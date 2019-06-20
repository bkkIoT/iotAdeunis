namespace codec {

  /**
   * Delta P 0x55 (periodic 0-10 V) frame parser
   */
  export class Deltap0x55Parser implements FrameParser {

    readonly deviceType = 'deltap';
    readonly frameCode = 0x55;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = {
        type: '0x55 Delta P - periodic 0-10 V',
        'instantaneous_voltage_mv': payload.readInt16BE(2),
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
      for (let offset = 4; offset < payload.byteLength; offset += 2) {
        const index = (offset - 2) / 2;
        const timeText = this.getTimeText(index);
        appContent[`voltage_${timeText}_mv`] = payload.readInt16BE(offset);
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

