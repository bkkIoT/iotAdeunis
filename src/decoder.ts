namespace codec {

  /**
   * Decoder class.
   *
   * Main class for decoding purposes.
   * Contains declaration of all required parsers and decode() method (API entry point).
   *
   * See below for explanations on parsers.
   */
  export class Decoder {

    /**
     * Parsers declaration.
     *
     * Array of parser implementations that can be used by the library.
     *
     * Parsers are specific handlers for parsing frame of a device type and a frame code.
     */
    protected parsers: FrameParser[] = [
      // Genric parsers not used for REPEATER
      new Generic0x10Parser(),
      new Generic0x20Parser(),
      new Generic0x30Parser(),
      new GenericStatusByteParser(),

      // DC product
      new Dc0x10Parser(),
      new DC0x30Parser(),
      new Dc0x40Parser(),

      // PULSE product
      new Pulse0x10Parser(),
      new Pulse0x11Parser(),
      new Pulse0x12Parser(),
      new Pulse0x30Parser(),
      new Pulse0x46Parser(),
      new Pulse0x47Parser(),
      new Pulse0x48Parser(),

      // TEMP product
      new TempStatusByteParser(),
      new Temp0x10Parser(),
      new Temp0x11Parser(),
      new Temp0x12Parser(),
      new Temp0x30Parser(),
      new Temp0x43Parser(),

      // COMFORT product
      new ComfortStatusByteParser(),
      new Sb0x1fParser(),
      new Sb0x51Parser(),
      new Sb0x52Parser(),
      new Comfort0x1fParser(),
      new Comfort0x10Parser(),
      new Comfort0x4cParser(),
      new Comfort0x4dParser(),
      new Comfort0x30Parser(),
      new Comfort0x51Parser(),
      new Comfort0x52Parser(),

      // MOTION produc
      // new Sb0x1fParser(),
      // new Sb0x51Parser(),
      // new Sb0x52Parser(),
      new MotionStatusByteParser(),
      new Motion0x1fParser(),
      new Motion0x10Parser(),
      new Motion0x30Parser(),
      new Motion0x4eParser(),
      new Motion0x4fParser(),
      new Motion0x50Parser(),
      new Motion0x51Parser(),
      new Motion0x52Parser(),

      // REPEARER product
      new Repeater0x01Parser(),
      new Repeater0x02Parser(),
      new Repeater0x03Parser(),
      new Repeater0x04Parser(),

      // DELTAP product
      // new Sb0x1fParser(),
      // new Sb0x51Parser(),
      // new Sb0x52Parser(),
      new DeltapStatusByteParser(),
      new Deltap0x1fParser(),
      new Deltap0x10Parser(),
      new Deltap0x11Parser(),
      new Deltap0x30Parser(),
      new Deltap0x51Parser(),
      new Deltap0x52Parser(),
      new Deltap0x53Parser(),
      new Deltap0x54Parser(),
      new Deltap0x55Parser(),
      new Deltap0x56Parser(),

    ];

    /**
     * Codec storage
     */
    private codecStorage: CodecStorage;

    /**
     * Constructor
     * @param options option object
     *   option.codecStorage: implementation of CodecStorage to use for external storage, leave blank if unknown
     */
    constructor(options?: { codecStorage?: CodecStorage }) {
      if (options && options.codecStorage) {
        // External storage: Node-RED...
        this.codecStorage = options.codecStorage;
      } else if (typeof localStorage !== 'undefined') {
        // Local storage: browser
        this.codecStorage = localStorage;
      } else {
        // Default (JS object)
        this.codecStorage = new InternalCodecStorage();
      }

      // TODO: check parsers uniqueness
    }

    /**
     * Get supported device types and frame codes.
     *
     * The returned pairs are available for decoding.
     */
    public getSupported() {
      return this.parsers
        .map(p => ({
          deviceType: p.deviceType,
          frameCode: p.frameCode
        }));
    }

    /**
     * Find device types
     * @param payloadString payload as hexadecimal string
     */
    public findDeviceTypes(payloadString: string) {
      // Check arguments
      if (!/^(?:[0-9a-f]{2}){2,}$/gi.test(payloadString)) {
        return [];
      }

      // Get buffer and frame code
      const payload = Buffer.from(payloadString, 'hex');
      const frameCode = payload[0];

      const deviceTypesFull = this.parsers
        .filter(p => p.frameCode === frameCode)
        .map(p => p.deviceType);
      return Array.from(new Set(deviceTypesFull));
    }

    /**
     * Decode given payload.
     *
     * Configuration frames with 0x10 frame code are persisted and reinjected in parsers. Pass these frames first
     * to enable device-specific decoding.
     * Example (Dry Contacts):
     *   Decoder.decode('100001016705464602'); // This frame indicates that channel 1 is configured as output
     *   Decoder.decode('4040000100000000000001'); // While decoding this data frame, channel 1 is treated as output
     *
     * @param payloadString payload as hexadecimal string
     * @param devId device ID: LoRa device EUI or Sigfox ID, leave blank if unknown
     * @param network network: lora868 or sigfox
     * @returns decoded data as JSON object
     */
    public decode(payloadString: string, devId: string = 'tmpDevId', network: Network = 'unknown') {
      // Check arguments
      if (!/^(?:[0-9a-f]{2}){2,}$/gi.test(payloadString)) {
        return { type: 'Invalid' } as Content;
      }

      // Get buffer and frame code
      const payload = Buffer.from(payloadString, 'hex');
      const frameCode = payload[0];

      // Handle device type
      let deviceType: string;
      deviceType = this.storeDeviceType(frameCode, devId);
      if (!deviceType) {
        deviceType = this.fetchDeviceType(devId);
      }

      // Handle configuration
      let configuration: Buffer;
      if (frameCode === 0x10) {
        configuration = payload;
        this.storeConfiguration(configuration, devId);
      } else {
        configuration = this.fetchConfiguration(devId);
      }

      // Handle specific parsing
      const activeParsers = this.getActiveParsers(deviceType, frameCode);
      const partialContents = activeParsers.map(p => {
        let partialContent: Content;
        try {
          partialContent = p.parseFrame(payload, configuration, network);
        } catch (error) {
          partialContent = { 'error': error.toString() };
        }
        return partialContent;
      });

      // Handle unsupported
      if (activeParsers.every(p => p.frameCode < 0)) {
        partialContents.push({ type: 'Unsupported' });
      }

      // Merge partial contents
      let content = Object.assign({}, ...partialContents);

      // Put 'type' at first position
      const typestr = content['type'];
      delete content['type'];
      content = Object.assign({type: typestr}, content);

      return content as Content;
    }

    /**
     * Set device type for given device ID.
     *
     * Gives additional information to the library to provide better decoding.
     * The library can also guess device type from passed frames in decode() method. Use this method when the frame
     * to decode does not refer to a single device type (example: 0x10 frames).
     *
     * @param deviceType device type, must be a value from getSupported() method
     * @param devId device ID: LoRa device EUI or Sigfox ID
     */
    public setDeviceType(deviceType: string, devId: string = 'tmpDevId') {
      this.codecStorage.setItem(`${devId}.deviceType`, deviceType);
    }

    /**
     * Clear stored data for a device ID:
     *   - Device type
     *   - Configuration
     * @param devId device ID: LoRa device EUI or Sigfox ID, leave blank if unknown
     */
    public clearStoredData(devId?: string) {
      if (!devId) {
        devId = 'tmpDevId';
      }

      ['deviceType', 'configuration']
        .map(suffix => `${devId}.${suffix}`)
        .forEach(key => this.codecStorage.removeItem(key));
    }

    /**
     * Fetch configuration frame
     * @param devId device ID
     */
    private fetchConfiguration(devId?: string) {
      if (!devId) {
        return Buffer.from('');
      }
      const value = this.codecStorage.getItem(`${devId}.configuration`);
      return Buffer.from(value || '', 'hex');
    }

    /**
     * Store configuration frame
     * @param payload payload
     * @param devId device ID
     */
    private storeConfiguration(payload: Buffer, devId?: string) {
      if (!devId) {
        return payload;
      }
      this.codecStorage.setItem(`${devId}.configuration`, payload.toString('hex'));
      return payload;
    }

    /**
     * Fetch device type
     * @param devId device ID
     */
    private fetchDeviceType(devId?: string) {
      if (!devId) {
        return '';
      }
      return this.codecStorage.getItem(`${devId}.deviceType`) || '';
    }

    /**
     * Store device type
     * @param frameCode frame code
     * @param devId device ID
     */
    private storeDeviceType(frameCode: number, devId?: string) {
      let deviceType = '';
      if (!devId) {
        return deviceType;
      }
      const matchingParsers = this.parsers.filter(p => p.deviceType !== 'any' && p.frameCode === frameCode);
      if (matchingParsers.length === 1) {
        deviceType = matchingParsers[0].deviceType;
        this.codecStorage.setItem(`${devId}.deviceType`, deviceType);
      }
      return deviceType;
    }

    /**
     * Get active parsers
     * @param deviceType device type
     * @param frameCode frame code
     */
    private getActiveParsers(deviceType: string, frameCode: number) {
      let activeParsers: FrameParser[] = [];
      if (deviceType) {
          if (deviceType !== 'repeater') {
              // Get parsers for any device types or any frame codes
              const genericParsers = this.parsers.filter(p => p.deviceType === 'any' &&
                                                        (p.frameCode < 0 || p.frameCode === frameCode));
              activeParsers = activeParsers.concat(genericParsers);
          }
          // Device type is known, get parsers for given device type AND frame code
          const selectedParsers = this.parsers.filter(p => p.deviceType === deviceType &&
                                                     (p.frameCode < 0 || p.frameCode === frameCode));
          activeParsers = activeParsers.concat(selectedParsers);
      } else {
          // Get parsers for any device types or any frame codes
          activeParsers = this.parsers.filter(p => p.deviceType === 'any' &&
                                                   (p.frameCode < 0 || p.frameCode === frameCode));

          // Device type is not known, get parsers for the frame code IF all matches the same device type
          const selectedParsers = this.parsers.filter(p => p.frameCode === frameCode);
          if (selectedParsers.length > 0) {
            const guessedDeviceType = selectedParsers[0].deviceType;
            if (selectedParsers.every(p => p.deviceType === guessedDeviceType)) {
              activeParsers = activeParsers.concat(selectedParsers);
            }
          }
      }

      // Return active parser
      return activeParsers;
    }

  }

}
