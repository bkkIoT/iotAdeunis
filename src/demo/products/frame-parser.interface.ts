namespace codec {

  /**
   * Frame parser interface
   */
  export interface FrameParser {

    /**
     * Device type
     * 'any' applies to all devices
     */
    readonly deviceType: string;

    /**
     * Frame code
     * -1 applies to all devices
     */
    readonly frameCode: number;

    /**
     * Parse frame
     * @param payload payload
     * @param configuration configuration
     */
    parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;

  }

}
