namespace codec {

  /**
   * Encoder class.
   *
   * Main class for encoding purposes.
   * Contains declaration of all required builders and encode() method (API entry point).
   *
   * See below for explanations on builders.
   */
  export class Encoder {

    /**
     * Builders declaration.
     *
     * Array of builder implementations that can be used by the library.
     *
     * Builders are specific handlers for encoding frame of a device type and a frame code.
     */
    protected builders: FrameBuilder<any>[] = [
      new Dc0x10Builder(),
      new Pulse0x10Builder(),
      new Comfort0x10Builder(),
      new Motion0x10Builder(),
      new Repeater0x01Builder(),
      new Repeater0x02Builder(),
      new Repeater0x03Builder(),
      new Repeater0x04Builder(),
      new Repeater0x05Builder()
    ];

    /**
     * Get supported device types and frame codes.
     *
     * The returned pairs are available for encoding.
     */
    public getSupported() {
      return this.builders
        .map(p => ({
          deviceType: p.deviceType,
          frameCode: p.frameCode
        }));
    }

    /**
     * Get input data types.
     * @param deviceType device type
     * @param frameCode frame code
     * @returns a map of available input data and associated types
     */
    public getInputDataTypes(deviceType: string, frameCode: number) {
      const builder = this.builders.find(b => b.deviceType === deviceType && b.frameCode === frameCode);
      if (!builder) {
        return {} as { [key: string]: string };
      }

      const inputdataTypes: { [key: string]: string } = {};
      const inputData = new builder.inputDataClass();
      for (const key in inputData) {
        if (inputData.hasOwnProperty(key)) {
          inputdataTypes[key] = typeof inputData[key];
        }
      }
      return inputdataTypes;
    }

    /**
     * Encode given arguments.
     *
     * Generates a string payload from given arguments. Data object members and associated types can be known using
     * getInputDataTypes() method.
     *
     * @param deviceType device type
     * @param frameCode frame code
     * @param network network: lora868 or sigfox
     * @param data data object: map of available input data and values
     * @returns encoded data as string
     */
    public encode(deviceType: string, frameCode: number, network: Network = 'unknown', data?: any) {
      const builder = this.builders.find(b => b.deviceType === deviceType && b.frameCode === frameCode);
      if (!builder) {
        return '';
      }

      const payload = builder.buildFrame(data || new builder.inputDataClass(), network);
      return payload.toString('hex');
    }

  }

}
