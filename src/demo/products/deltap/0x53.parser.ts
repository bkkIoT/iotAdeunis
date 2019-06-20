namespace codec {

  /**
   * Delta P 0x53 (Delta P periodic) frame parser
   */
  export class Deltap0x53Parser implements FrameParser {

    readonly deviceType = 'deltap';
    readonly frameCode = 0x53;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = {
        type: '0x53 Delta P periodic data',
        'instantaneous_delta_pressure_pa': payload.readInt16BE(2),
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
        appContent[`delta_pressure_${timeText}_pa`] = payload.readInt16BE(offset);
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
