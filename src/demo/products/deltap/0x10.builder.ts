namespace codec {

  const number_of_sampling_before_historization_DEFAULT = 1;

  /**
   * Deltap 0x10 (configuration) input data
   */
  export class Deltap0x10InputData {
    readingFrequency = 600;
  }

  /**
   * Deltap 0x10 (configuration) frame builder
   */
  export class Deltap0x10Builder implements FrameBuilder<Deltap0x10InputData> {

    readonly deviceType = 'deltap';
    readonly frameCode = 0x10;

    readonly inputDataClass = Deltap0x10InputData;

    public buildFrame(inputData: Deltap0x10InputData, network: Network) {
      const payload = Buffer.alloc(10);
      payload[0] = this.frameCode;

      // reading frequency = acquisition period * historization period
      const dataAcquisitionPeriod = inputData.readingFrequency / number_of_sampling_before_historization_DEFAULT;

      // S320
      payload.writeUInt16BE(number_of_sampling_before_historization_DEFAULT, 6);

      // S321
      payload.writeUInt16BE(this.sanitizeUInt16(dataAcquisitionPeriod / 2), 8);

      return payload;
    }

    /**
     * Sanitize UInt16
     * @param unsafeUInt16 unsafe UInt16
     */
    private sanitizeUInt16(unsafeUInt16: number) {
      return Math.max(0, Math.min(Math.trunc(unsafeUInt16), Math.pow(2, 16) - 1));
    }

  }
}
