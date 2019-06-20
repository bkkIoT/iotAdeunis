namespace codec {

  /**
   * Dry Contacts 0x10 (configuration) input data
   */
  export class Dc0x10InputData {
    channel1Output = false;
    channel2Output = false;
    channel3Output = false;
    channel4Output = false;
  }

  /**
   * Dry Contacts 0x10 (configuration) frame builder
   */
  export class Dc0x10Builder implements FrameBuilder<Dc0x10InputData> {

    readonly deviceType = 'dc';
    readonly frameCode = 0x10;

    readonly inputDataClass = Dc0x10InputData;

    public buildFrame(inputData: Dc0x10InputData, network: Network) {
      const payload = Buffer.alloc(9);
      payload[0] = this.frameCode;

      // Channel configuration
      payload[4] = inputData.channel1Output ? 0x07 : 0x01;
      payload[5] = inputData.channel2Output ? 0x07 : 0x01;
      payload[6] = inputData.channel3Output ? 0x07 : 0x01;
      payload[7] = inputData.channel4Output ? 0x07 : 0x01;

      return payload;
    }

  }

}
