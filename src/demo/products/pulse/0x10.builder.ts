namespace codec {

  /**
   * Pulse 0x10 (configuration) input data
   */
  export class Pulse0x10InputData {
    historicLogEvery1h = false;
  }

  /**
   * Pulse 0x10 (configuration) frame builder
   */
  export class Pulse0x10Builder implements FrameBuilder<Pulse0x10InputData> {

    readonly deviceType = 'pulse';
    readonly frameCode = 0x10;

    readonly inputDataClass = Pulse0x10InputData;

    public buildFrame(inputData: Pulse0x10InputData, network: Network) {
      const payload = Buffer.alloc(22);
      payload[0] = this.frameCode;

      // Historic mode
      payload[6] = inputData.historicLogEvery1h ? 0x02 : 0x01;

      return payload;
    }

  }
}
