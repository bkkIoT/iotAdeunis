namespace codec {

  /**
   * Frame builder interface
   */
  export interface FrameBuilder<T> {

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
     * Input data class
     */
    readonly inputDataClass: { new(...args: any[]): T; };

    /**
     * Build frame
     * @param inputData input data
     */
    buildFrame(inputData: T, network: Network): Buffer;

  }

}
